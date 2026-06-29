import 'dotenv/config';

import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_PROJECT_ID = '5rux0mv2';
const EXPECTED_DATASET = 'production';
const API_VERSION = '2024-01-01';
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_BATCH_PATH = resolve(SCRIPT_DIR, 'seo-metadata-batch-1.json');

function parseArgs(argv) {
  let sawApply = false;
  let sawDryRun = false;
  const options = {
    apply: false,
    dryRun: true,
    batchPath: DEFAULT_BATCH_PATH,
  };

  for (const arg of argv) {
    if (arg === '--apply') {
      sawApply = true;
      options.apply = true;
      options.dryRun = false;
    } else if (arg === '--dry-run') {
      sawDryRun = true;
      options.dryRun = true;
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

  return options;
}

function printHelp() {
  console.log(`
Usage:
  node scripts/sanity/update-seo-metadata.mjs [--dry-run]
  node scripts/sanity/update-seo-metadata.mjs --apply

Options:
  --dry-run       Preview mutations without writing. This is the default.
  --apply         Write the reviewed batch to Sanity after safety checks.
  --batch=PATH    Use a different structured metadata batch file.
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

  if (!Array.isArray(batch.updates) || batch.updates.length === 0) {
    throw new Error('Batch file has no updates.');
  }

  return batch;
}

function getTarget() {
  return {
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || EXPECTED_DATASET,
    token: process.env.SANITY_WRITE_TOKEN,
  };
}

function validateTarget({ apply }, target) {
  if (!target.projectId) {
    throw new Error('PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID is required.');
  }

  if (apply && !target.token) {
    throw new Error('Refusing --apply: SANITY_WRITE_TOKEN is required.');
  }

  if (apply && (target.projectId !== EXPECTED_PROJECT_ID || target.dataset !== EXPECTED_DATASET)) {
    throw new Error(
      `Refusing --apply: target must be ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}, got ${target.projectId}/${target.dataset}.`
    );
  }
}

function createSanityClient(target, apply) {
  return createClient({
    projectId: target.projectId,
    dataset: target.dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    token: apply ? target.token : target.token || undefined,
    perspective: 'published',
  });
}

function uniqueSlugs(batch, documentType) {
  return [
    ...new Set(
      batch.updates
        .filter((update) => update.documentType === documentType && update.slug)
        .map((update) => update.slug)
    ),
  ];
}

async function fetchCurrentDocuments(client, batch) {
  const params = {
    industrySlugs: uniqueSlugs(batch, 'industry'),
    blogPostSlugs: uniqueSlugs(batch, 'blogPost'),
    caseStudySlugs: uniqueSlugs(batch, 'caseStudy'),
  };

  return client.fetch(
    `{
      "siteSettings": *[_type == "siteSettings"][0] {
        _id,
        _type,
        siteName,
        defaultSeoTitle,
        defaultSeoDescription,
        defaultOgImage
      },
      "industries": *[_type == "industry" && slug.current in $industrySlugs] {
        _id,
        _type,
        title,
        "slug": slug.current,
        seoTitle,
        seoDescription
      },
      "blogPosts": *[_type == "blogPost" && slug.current in $blogPostSlugs] {
        _id,
        _type,
        title,
        "slug": slug.current,
        seoTitle,
        seoDescription
      },
      "caseStudies": *[_type == "caseStudy" && slug.current in $caseStudySlugs] {
        _id,
        _type,
        title,
        "slug": slug.current,
        seoTitle,
        seoDescription
      }
    }`,
    params
  );
}

function documentKey(documentType, slug) {
  return `${documentType}:${slug || 'singleton'}`;
}

function buildDocumentLookup(documents) {
  const lookup = new Map();

  if (documents.siteSettings) {
    lookup.set(documentKey('siteSettings'), documents.siteSettings);
  }

  for (const doc of documents.industries || []) {
    lookup.set(documentKey('industry', doc.slug), doc);
  }

  for (const doc of documents.blogPosts || []) {
    lookup.set(documentKey('blogPost', doc.slug), doc);
  }

  for (const doc of documents.caseStudies || []) {
    lookup.set(documentKey('caseStudy', doc.slug), doc);
  }

  return lookup;
}

function sameValue(left, right) {
  return (left ?? null) === (right ?? null);
}

function isAllowedCurrent(currentValue, allowedCurrent) {
  if (!Array.isArray(allowedCurrent)) return false;
  return allowedCurrent.some((allowed) => sameValue(currentValue, allowed));
}

function displayValue(value) {
  if (value === null || value === undefined || value === '') return '<empty>';
  return String(value);
}

function buildPlan(batch, lookup) {
  const results = [];

  for (const update of batch.updates) {
    const doc = lookup.get(documentKey(update.documentType, update.slug));

    if (!doc?._id) {
      for (const field of Object.keys(update.fields || {})) {
        results.push({
          status: 'missing',
          documentType: update.documentType,
          slug: update.slug,
          title: update.title,
          priority: update.priority,
          field,
          currentValue: undefined,
          proposedValue: update.fields[field].proposed,
          reason: 'Document was not found in Sanity.',
        });
      }
      continue;
    }

    const title = update.documentType === 'siteSettings'
      ? doc.siteName || update.title
      : doc.title || update.title;

    for (const [field, fieldUpdate] of Object.entries(update.fields || {})) {
      const currentValue = doc[field];
      const proposedValue = fieldUpdate.proposed;
      const base = {
        documentId: doc._id,
        documentType: update.documentType,
        slug: update.slug,
        title,
        priority: update.priority,
        field,
        currentValue,
        proposedValue,
      };

      if (sameValue(currentValue, proposedValue)) {
        results.push({ ...base, status: 'unchanged', reason: 'Current value already matches proposed value.' });
      } else if (isAllowedCurrent(currentValue, fieldUpdate.allowedCurrent)) {
        results.push({ ...base, status: 'change', reason: 'Current value matches inventory guard.' });
      } else {
        results.push({
          ...base,
          status: 'blocked',
          reason: 'Current value no longer matches the inventory guard; refusing to overwrite.',
        });
      }
    }
  }

  return results;
}

function printPlan(batch, target, options, results) {
  const mode = options.apply ? 'APPLY' : 'DRY RUN';
  console.log(`SEO metadata update batch: ${batch.name}`);
  console.log(`Source inventory: ${batch.source}`);
  console.log(`Mode: ${mode}`);
  console.log(`Target: ${target.projectId}/${target.dataset}`);

  for (const result of results) {
    const slug = result.slug ? `/${result.slug}` : '';
    const willChange = result.status === 'change'
      ? options.apply ? 'yes' : 'yes, dry-run only'
      : 'no';

    console.log('\n---');
    console.log(`Document: ${result.documentType}${slug} (${result.title || 'Untitled'})`);
    console.log(`Priority: ${result.priority}`);
    console.log(`Field: ${result.field}`);
    console.log(`Current: ${displayValue(result.currentValue)}`);
    console.log(`Proposed: ${displayValue(result.proposedValue)}`);
    console.log(`Will be changed: ${willChange}`);
    console.log(`Status: ${result.status}`);
    console.log(`Reason: ${result.reason}`);
  }

  const summary = results.reduce(
    (counts, result) => {
      counts[result.status] = (counts[result.status] || 0) + 1;
      return counts;
    },
    {}
  );

  console.log('\nSummary:');
  console.log(`  changes: ${summary.change || 0}`);
  console.log(`  unchanged: ${summary.unchanged || 0}`);
  console.log(`  blocked: ${summary.blocked || 0}`);
  console.log(`  missing: ${summary.missing || 0}`);
}

function groupChanges(results) {
  const grouped = new Map();

  for (const result of results.filter((item) => item.status === 'change')) {
    const fields = grouped.get(result.documentId) || {};
    fields[result.field] = result.proposedValue;
    grouped.set(result.documentId, fields);
  }

  return grouped;
}

async function applyChanges(client, results) {
  const grouped = groupChanges(results);

  if (grouped.size === 0) {
    console.log('\nNo Sanity mutations to apply.');
    return;
  }

  let transaction = client.transaction();
  for (const [documentId, fields] of grouped.entries()) {
    transaction = transaction.patch(documentId, (patch) => patch.set(fields));
  }

  const response = await transaction.commit({ tag: 'seo.metadata.batch1' });
  console.log(`\nApplied Sanity transaction with ${grouped.size} document patch(es).`);
  console.log(JSON.stringify(response, null, 2));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const batch = await loadBatch(options.batchPath);
  const target = getTarget();
  validateTarget(options, target);

  const client = createSanityClient(target, options.apply);
  const currentDocuments = await fetchCurrentDocuments(client, batch);
  const lookup = buildDocumentLookup(currentDocuments);
  const results = buildPlan(batch, lookup);

  printPlan(batch, target, options, results);

  const hasUnsafeResult = results.some((result) => result.status === 'blocked' || result.status === 'missing');
  if (options.apply && hasUnsafeResult) {
    throw new Error('Refusing --apply because one or more fields are blocked or missing.');
  }

  if (!options.apply) {
    console.log('\nDry run only. No Sanity writes were made. Pass --apply to write after reviewing this output.');
    return;
  }

  await applyChanges(client, results);
}

const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (executedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`\nERROR: ${error.message}`);
    process.exitCode = 1;
  });
}

export {
  buildDocumentLookup,
  buildPlan,
  displayValue,
  documentKey,
  groupChanges,
  isAllowedCurrent,
  parseArgs,
  sameValue,
};
