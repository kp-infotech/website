import 'dotenv/config';

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_PROJECT_ID = '5rux0mv2';
const EXPECTED_DATASET = 'production';
const API_VERSION = '2024-01-01';
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_BATCH_PATH = resolve(SCRIPT_DIR, 'p0-insight-draft-import.json');
const DRAFT_SOURCE_ROOT = 'docs/seo-migration/p0-content-drafts';
const ALLOWED_CATEGORY_SLUGS = new Set([
  'custom-software-development',
  'automation-ai',
  'erp-business-systems',
  'cloud-devops',
]);
const INTERNAL_PATH_TO_TYPE = new Map([
  ['services', 'service'],
  ['industries', 'industry'],
  ['work', 'caseStudy'],
  ['insights', 'blogPost'],
]);

function parseArgs(argv) {
  let sawApply = false;
  let sawDryRun = false;
  const options = {
    apply: false,
    dryRun: true,
    updateExistingDrafts: false,
    batchPath: DEFAULT_BATCH_PATH,
  };

  for (const arg of argv) {
    if (arg === '--apply') {
      sawApply = true;
      options.apply = true;
      options.dryRun = false;
    } else if (arg === '--dry-run') {
      sawDryRun = true;
      options.apply = false;
      options.dryRun = true;
    } else if (arg === '--update-existing-drafts') {
      options.updateExistingDrafts = true;
    } else if (arg.startsWith('--batch=')) {
      options.batchPath = resolve(process.cwd(), arg.slice('--batch='.length));
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (sawApply && sawDryRun) {
    throw new Error('Pass either --apply or --dry-run, not both.');
  }

  if (!options.apply && options.updateExistingDrafts) {
    throw new Error('--update-existing-drafts is only meaningful with --apply.');
  }

  return options;
}

function printHelp() {
  console.log(`
Usage:
  node scripts/sanity/import-p0-insight-drafts.mjs [--dry-run]
  node scripts/sanity/import-p0-insight-drafts.mjs --apply
  node scripts/sanity/import-p0-insight-drafts.mjs --apply --update-existing-drafts

Options:
  --dry-run                  Preview draft mutations without writing. This is the default.
  --apply                    Create reviewed Sanity draft documents after safety checks.
  --update-existing-drafts   Allow patching existing draft documents with the same slug.
  --batch=PATH               Use a different structured draft import batch file.
`);
}

async function loadBatch(batchPath) {
  const raw = await readFile(batchPath, 'utf8');
  const batch = JSON.parse(raw);

  if (batch.projectId !== EXPECTED_PROJECT_ID || batch.dataset !== EXPECTED_DATASET) {
    throw new Error(
      `Batch target mismatch. Expected ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}, got ${batch.projectId}/${batch.dataset}.`
    );
  }

  if (!Array.isArray(batch.articles) || batch.articles.length === 0) {
    throw new Error('Batch file has no articles.');
  }

  validateBatchArticles(batch.articles);
  return batch;
}

function validateBatchArticles(articles) {
  const seenSlugs = new Set();

  for (const article of articles) {
    const label = article.slug || article.title || '<unknown article>';

    if (article.documentType !== 'blogPost') {
      throw new Error(`Article ${label} must target documentType blogPost.`);
    }

    for (const field of ['draftId', 'title', 'slug', 'seoTitle', 'seoDescription', 'excerpt', 'categorySlug', 'categoryId', 'sourceDraft']) {
      if (!article[field]) {
        throw new Error(`Article ${label} is missing required field ${field}.`);
      }
    }

    if (!article.draftId.startsWith('drafts.')) {
      throw new Error(`Article ${label} has unsafe draftId ${article.draftId}.`);
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Article ${label} has invalid slug ${article.slug}.`);
    }

    if (seenSlugs.has(article.slug)) {
      throw new Error(`Duplicate article slug in batch: ${article.slug}.`);
    }
    seenSlugs.add(article.slug);

    if (!ALLOWED_CATEGORY_SLUGS.has(article.categorySlug)) {
      throw new Error(`Article ${label} uses unapproved category slug ${article.categorySlug}.`);
    }

    if (String(article.categoryId).startsWith('drafts.')) {
      throw new Error(`Article ${label} must reference a published category document, got ${article.categoryId}.`);
    }

    if (article.seoTitle.length > 60 || article.seoDescription.length > 160) {
      throw new Error(`Article ${label} has SEO fields outside reviewed length limits.`);
    }

    if (String(article.sourceDraft).includes('..') || !String(article.sourceDraft).startsWith(DRAFT_SOURCE_ROOT)) {
      throw new Error(`Article ${label} sourceDraft must stay under ${DRAFT_SOURCE_ROOT}.`);
    }
  }
}

async function loadArticleDrafts(batch) {
  const articles = [];
  const sourceRoot = resolve(process.cwd(), DRAFT_SOURCE_ROOT);

  for (const article of batch.articles) {
    const sourcePath = resolve(process.cwd(), article.sourceDraft);

    if (!sourcePath.startsWith(sourceRoot)) {
      throw new Error(`Refusing to read source outside ${DRAFT_SOURCE_ROOT}: ${article.sourceDraft}`);
    }

    const sourceMarkdown = await readFile(sourcePath, 'utf8');
    const contentMarkdown = extractFullArticleMarkdown(sourceMarkdown, article.sourceDraft);
    articles.push({ ...article, contentMarkdown });
  }

  return articles;
}

function extractFullArticleMarkdown(sourceMarkdown, sourceName = 'source draft') {
  const normalized = sourceMarkdown.replace(/\r\n/g, '\n');
  const match = normalized.match(/^## Full Article Draft\s*$/m);

  if (!match || match.index === undefined) {
    throw new Error(`Could not find "## Full Article Draft" in ${sourceName}.`);
  }

  return normalized.slice(match.index + match[0].length).trim();
}

function getTarget() {
  return {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || EXPECTED_DATASET,
    readToken: process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN,
    writeToken: process.env.SANITY_WRITE_TOKEN,
  };
}

function validateTarget(options, target) {
  if (!target.projectId) {
    throw new Error('PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID is required.');
  }

  if (target.projectId !== EXPECTED_PROJECT_ID || target.dataset !== EXPECTED_DATASET) {
    throw new Error(
      `Refusing to target anything except ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}; got ${target.projectId}/${target.dataset}.`
    );
  }

  if (options.apply && !target.writeToken) {
    throw new Error('Refusing --apply: SANITY_WRITE_TOKEN is required.');
  }
}

function createSanityClient(target, { token, perspective }) {
  return createClient({
    projectId: target.projectId,
    dataset: target.dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    token,
    perspective,
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function refKey(target) {
  return `${target.type}:${target.slug}`;
}

function internalTargetForHref(href) {
  if (!href || !href.startsWith('/')) return null;

  const pathOnly = href.split(/[?#]/)[0].replace(/\/+$/, '');
  const parts = pathOnly.split('/').filter(Boolean);
  const type = INTERNAL_PATH_TO_TYPE.get(parts[0]);

  if (!type || !parts[1]) {
    return { type: 'unknown', slug: pathOnly, href };
  }

  return { type, slug: parts[1], href };
}

function extractInternalLinkTargets(markdown) {
  const targets = new Map();
  const unknown = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const href = match[2];
    const target = internalTargetForHref(href);

    if (!target) continue;
    if (target.type === 'unknown') {
      unknown.push(href);
      continue;
    }

    targets.set(refKey(target), target);
  }

  return { targets: [...targets.values()], unknown };
}

function collectAllInternalLinkTargets(articles) {
  const targets = new Map();

  for (const article of articles) {
    const extracted = extractInternalLinkTargets(article.contentMarkdown);
    for (const target of extracted.targets) {
      targets.set(refKey(target), target);
    }
  }

  return [...targets.values()];
}

function slugsForType(targets, type) {
  return unique(targets.filter((target) => target.type === type).map((target) => target.slug));
}

async function fetchPublishedState(client, articles) {
  const internalTargets = collectAllInternalLinkTargets(articles);
  const params = {
    articleSlugs: unique(articles.map((article) => article.slug)),
    categorySlugs: unique(articles.map((article) => article.categorySlug)),
    categoryIds: unique(articles.map((article) => article.categoryId)),
    serviceSlugs: slugsForType(internalTargets, 'service'),
    industrySlugs: slugsForType(internalTargets, 'industry'),
    caseStudySlugs: slugsForType(internalTargets, 'caseStudy'),
    blogPostRefSlugs: slugsForType(internalTargets, 'blogPost'),
  };

  return client.fetch(
    `{
      "publishedPosts": *[_type == "blogPost" && slug.current in $articleSlugs] {
        _id,
        _type,
        title,
        "slug": slug.current
      },
      "categories": *[_type == "blogCategory" && (_id in $categoryIds || slug.current in $categorySlugs)] {
        _id,
        _type,
        title,
        "slug": slug.current
      },
      "services": *[_type == "service" && slug.current in $serviceSlugs] {
        _id,
        _type,
        title,
        "slug": slug.current
      },
      "industries": *[_type == "industry" && slug.current in $industrySlugs] {
        _id,
        _type,
        title,
        "slug": slug.current
      },
      "caseStudies": *[_type == "caseStudy" && slug.current in $caseStudySlugs] {
        _id,
        _type,
        title,
        "slug": slug.current
      },
      "refBlogPosts": *[_type == "blogPost" && slug.current in $blogPostRefSlugs] {
        _id,
        _type,
        title,
        "slug": slug.current
      }
    }`,
    params
  );
}

async function fetchDraftState(client, articles) {
  if (!client) {
    return { checked: false, draftsById: [], draftsBySlug: [] };
  }

  const params = {
    draftIds: unique(articles.map((article) => article.draftId)),
    slugs: unique(articles.map((article) => article.slug)),
  };

  const state = await client.fetch(
    `{
      "draftsById": *[_type == "blogPost" && _id in $draftIds] {
        _id,
        _type,
        title,
        "slug": slug.current
      },
      "draftsBySlug": *[_type == "blogPost" && _id in path("drafts.**") && slug.current in $slugs] {
        _id,
        _type,
        title,
        "slug": slug.current
      }
    }`,
    params
  );

  return { checked: true, ...state };
}

function mapBySlug(documents = []) {
  const lookup = new Map();
  for (const doc of documents) {
    if (doc?.slug) lookup.set(doc.slug, doc);
  }
  return lookup;
}

function mapById(documents = []) {
  const lookup = new Map();
  for (const doc of documents) {
    if (doc?._id) lookup.set(doc._id, doc);
  }
  return lookup;
}

function buildInternalReferenceLookup(publishedState) {
  const lookup = new Map();
  const groups = [
    ['service', publishedState.services],
    ['industry', publishedState.industries],
    ['caseStudy', publishedState.caseStudies],
    ['blogPost', publishedState.refBlogPosts],
  ];

  for (const [type, docs] of groups) {
    for (const doc of docs || []) {
      if (doc?.slug) lookup.set(`${type}:${doc.slug}`, doc);
    }
  }

  return lookup;
}

function findExistingDraft(article, draftState) {
  if (!draftState.checked) return null;

  const draftById = mapById(draftState.draftsById);
  if (draftById.has(article.draftId)) {
    return draftById.get(article.draftId);
  }

  return mapBySlug(draftState.draftsBySlug).get(article.slug) || null;
}

function buildPlan(articles, publishedState, draftState, options) {
  const publishedPostsBySlug = mapBySlug(publishedState.publishedPosts);
  const categoriesById = mapById(publishedState.categories);
  const internalReferenceLookup = buildInternalReferenceLookup(publishedState);

  return articles.map((article) => {
    const reasons = [];
    const extractedLinks = extractInternalLinkTargets(article.contentMarkdown);
    const publishedPost = publishedPostsBySlug.get(article.slug);
    const category = categoriesById.get(article.categoryId);
    const existingDraft = findExistingDraft(article, draftState);

    if (publishedPost) {
      reasons.push(`Published blogPost already exists for slug "${article.slug}" (${publishedPost._id}).`);
    }

    if (!category) {
      reasons.push(`Required blogCategory ID "${article.categoryId}" was not found in published Sanity content.`);
    } else if (category.slug !== article.categorySlug) {
      reasons.push(
        `Required blogCategory ID "${article.categoryId}" has slug "${category.slug}", expected "${article.categorySlug}".`
      );
    }

    for (const href of extractedLinks.unknown) {
      reasons.push(`Unsupported internal link path in article body: ${href}.`);
    }

    for (const target of extractedLinks.targets) {
      if (!internalReferenceLookup.has(refKey(target))) {
        reasons.push(`Internal link target was not found in published Sanity content: ${target.href}.`);
      }
    }

    if (existingDraft && !options.updateExistingDrafts) {
      reasons.push(`Existing draft blogPost already uses this slug (${existingDraft._id}).`);
    }

    const status = reasons.length > 0
      ? 'blocked'
      : existingDraft
        ? 'update-draft'
        : 'create-draft';
    const draftId = existingDraft?._id || article.draftId;
    const draftDocument = status === 'blocked'
      ? undefined
      : buildDraftDocument(article, {
        category,
        draftId,
        internalReferenceLookup,
      });

    return {
      article,
      draftId,
      draftDocument,
      existingDraft,
      linkTargets: extractedLinks.targets,
      reasons,
      status,
      draftCheck: draftState.checked ? 'checked' : 'not checked',
    };
  });
}

function estimateReadTime(markdown) {
  const wordCount = markdown
    .replace(/[`*_#[\]()|>.-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 220))} min`;
}

function buildDraftDocument(article, { category, draftId, internalReferenceLookup }) {
  const doc = {
    _id: draftId,
    _type: 'blogPost',
    title: article.title,
    slug: { _type: 'slug', current: article.slug },
    category: { _type: 'reference', _ref: category._id },
    excerpt: article.excerpt,
    readTime: article.readTime || estimateReadTime(article.contentMarkdown),
    featured: false,
    tags: article.tags || [],
    content: markdownToPortableText(article.contentMarkdown, internalReferenceLookup),
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
  };

  if (article.publishedAt) {
    doc.publishedAt = article.publishedAt;
  }

  return doc;
}

function markdownToPortableText(markdown, internalReferenceLookup) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  const context = {
    blockIndex: 0,
    internalReferenceLookup,
  };

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const codeFence = trimmed.match(/^```(\w+)?/);
    if (codeFence) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({
        _key: nextBlockKey(context),
        _type: 'code',
        language: codeFence[1] || 'text',
        code: codeLines.join('\n'),
      });
      continue;
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      blocks.push(textBlock(heading[1].length === 2 ? 'h2' : 'h3', heading[2], context));
      index += 1;
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        blocks.push(textBlock('normal', lines[index].trim().replace(/^-\s+/, ''), context, {
          listItem: 'bullet',
          level: 1,
        }));
        index += 1;
      }
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        blocks.push(textBlock('normal', lines[index].trim().replace(/^\d+\.\s+/, ''), context, {
          listItem: 'number',
          level: 1,
        }));
        index += 1;
      }
      continue;
    }

    if (trimmed.startsWith('|')) {
      const tableLines = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      blocks.push(...tableToPortableText(tableLines, context));
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(textBlock('blockquote', quoteLines.join(' '), context));
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isSpecialMarkdownStart(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push(textBlock('normal', paragraphLines.join(' '), context));
  }

  return blocks;
}

function isSpecialMarkdownStart(trimmed) {
  return (
    /^#{2,3}\s+/.test(trimmed) ||
    /^-\s+/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed) ||
    trimmed.startsWith('|') ||
    trimmed.startsWith('>') ||
    trimmed.startsWith('```')
  );
}

function tableToPortableText(tableLines, context) {
  const rows = tableLines.map(parseTableRow).filter((row) => row.length > 0);
  if (rows.length === 0) return [];

  const hasHeader = rows.length > 1 && rows[1].every((cell) => /^:?-{3,}:?$/.test(cell));
  const headers = hasHeader ? rows[0] : [];
  const dataRows = hasHeader ? rows.slice(2) : rows;

  return dataRows.map((row) => {
    const text = headers.length > 0
      ? row.map((cell, cellIndex) => `${headers[cellIndex] || `Column ${cellIndex + 1}`}: ${cell}`).join('; ')
      : row.join('; ');

    return textBlock('normal', text, context, {
      listItem: 'bullet',
      level: 1,
    });
  });
}

function parseTableRow(line) {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function nextBlockKey(context) {
  const key = `b${String(context.blockIndex).padStart(4, '0')}`;
  context.blockIndex += 1;
  return key;
}

function textBlock(style, text, context, extra = {}) {
  const key = nextBlockKey(context);
  const { children, markDefs } = parseInlineSpans(text, context, key);

  return {
    _key: key,
    _type: 'block',
    style,
    markDefs,
    children,
    ...extra,
  };
}

function parseInlineSpans(text, context, blockKey) {
  const children = [];
  const markDefs = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let cursor = 0;
  let spanIndex = 0;
  let match;

  function addSpan(value, marks = []) {
    if (!value) return;
    children.push({
      _key: `${blockKey}s${spanIndex}`,
      _type: 'span',
      marks,
      text: value,
    });
    spanIndex += 1;
  }

  while ((match = linkPattern.exec(text)) !== null) {
    addSpan(text.slice(cursor, match.index));

    const href = match[2];
    const markKey = `${blockKey}m${markDefs.length}`;
    const target = internalTargetForHref(href);

    if (target && target.type !== 'unknown') {
      const referencedDocument = context.internalReferenceLookup.get(refKey(target));
      if (!referencedDocument?._id) {
        throw new Error(`Missing internal link reference for ${href}.`);
      }

      markDefs.push({
        _key: markKey,
        _type: 'internalLink',
        reference: {
          _type: 'reference',
          _ref: referencedDocument._id,
        },
      });
    } else {
      markDefs.push({
        _key: markKey,
        _type: 'externalLink',
        href,
        openInNewTab: !href.startsWith('/'),
      });
    }

    addSpan(match[1], [markKey]);
    cursor = match.index + match[0].length;
  }

  addSpan(text.slice(cursor));

  if (children.length === 0) {
    addSpan(text);
  }

  return { children, markDefs };
}

function printPlan(batch, target, options, plan) {
  const mode = options.apply ? 'APPLY' : 'DRY RUN';
  const summary = plan.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {});

  console.log(`P0 insight draft import batch: ${batch.name}`);
  console.log(`Source: ${batch.source}`);
  console.log(`Mode: ${mode}`);
  console.log(`Target: ${target.projectId}/${target.dataset}`);
  console.log(`Existing draft updates: ${options.updateExistingDrafts ? 'allowed' : 'blocked by default'}`);

  for (const item of plan) {
    const article = item.article;
    const blockCount = item.draftDocument?.content?.length || 0;
    const willWrite = options.apply && ['create-draft', 'update-draft'].includes(item.status) ? 'yes' : 'no';

    console.log('\n---');
    console.log(`Document: blogPost /insights/${article.slug}/`);
    console.log(`Title: ${article.title}`);
    console.log(`Draft ID: ${item.draftId}`);
    console.log(`Category slug: ${article.categorySlug}`);
    console.log(`Category ID: ${article.categoryId}`);
    console.log(`Source draft: ${article.sourceDraft}`);
    console.log(`Action: ${item.status}`);
    console.log(`Will write: ${willWrite}`);
    console.log(`Existing draft check: ${item.draftCheck}`);
    console.log(`Internal references: ${item.linkTargets.length}`);
    console.log(`Content blocks: ${blockCount}`);
    console.log(`SEO title: ${article.seoTitle}`);
    console.log(`SEO description: ${article.seoDescription}`);

    if (item.existingDraft) {
      console.log(`Existing draft: ${item.existingDraft._id}`);
    }

    if (item.reasons.length > 0) {
      console.log('Reasons:');
      for (const reason of item.reasons) {
        console.log(`  - ${reason}`);
      }
    }
  }

  console.log('\nSummary:');
  console.log(`  create-draft: ${summary['create-draft'] || 0}`);
  console.log(`  update-draft: ${summary['update-draft'] || 0}`);
  console.log(`  blocked: ${summary.blocked || 0}`);

  if (!options.apply) {
    console.log('\nDry run only. No Sanity writes were made. Pass --apply after reviewing this output.');
    if (plan.some((item) => item.draftCheck === 'not checked')) {
      console.log('Existing draft collisions are fully checked when SANITY_READ_TOKEN or SANITY_WRITE_TOKEN is set; --apply always requires SANITY_WRITE_TOKEN.');
    }
  }
}

function assertApplyIsSafe(plan) {
  const blocked = plan.filter((item) => item.status === 'blocked');
  if (blocked.length > 0) {
    throw new Error(`Refusing --apply because ${blocked.length} article(s) are blocked.`);
  }

  for (const item of plan) {
    if (!item.draftId.startsWith('drafts.')) {
      throw new Error(`Refusing --apply because ${item.article.slug} does not use a drafts.* document ID.`);
    }
  }
}

async function applyDrafts(client, plan) {
  const writableItems = plan.filter((item) => ['create-draft', 'update-draft'].includes(item.status));

  if (writableItems.length === 0) {
    console.log('\nNo Sanity draft mutations to apply.');
    return;
  }

  let transaction = client.transaction();

  for (const item of writableItems) {
    if (item.status === 'create-draft') {
      transaction = transaction.create(item.draftDocument);
      continue;
    }

    const { _id, _type, ...fields } = item.draftDocument;
    transaction = transaction.patch(_id, (patch) => patch.set(fields));
  }

  const response = await transaction.commit({ tag: 'seo.p0-insight-drafts' });
  console.log(`\nApplied Sanity transaction with ${writableItems.length} draft mutation(s).`);
  console.log(JSON.stringify(response, null, 2));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const batch = await loadBatch(options.batchPath);
  const articles = await loadArticleDrafts(batch);
  const target = getTarget();
  validateTarget(options, target);

  const publishedClient = createSanityClient(target, {
    token: target.readToken,
    perspective: 'published',
  });
  const draftClient = target.readToken || options.apply
    ? createSanityClient(target, {
      token: options.apply ? target.writeToken : target.readToken,
      perspective: 'raw',
    })
    : null;

  const publishedState = await fetchPublishedState(publishedClient, articles);
  const draftState = await fetchDraftState(draftClient, articles);
  const plan = buildPlan(articles, publishedState, draftState, options);

  printPlan(batch, target, options, plan);

  if (!options.apply) {
    return;
  }

  assertApplyIsSafe(plan);

  const writeClient = createSanityClient(target, {
    token: target.writeToken,
    perspective: 'raw',
  });
  await applyDrafts(writeClient, plan);
}

const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (executedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`\nERROR: ${error.message}`);
    process.exitCode = 1;
  });
}

export {
  buildDraftDocument,
  buildPlan,
  collectAllInternalLinkTargets,
  estimateReadTime,
  extractFullArticleMarkdown,
  extractInternalLinkTargets,
  internalTargetForHref,
  loadBatch,
  markdownToPortableText,
  parseArgs,
};
