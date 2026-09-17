// Article titles own H1. Preserve existing section levels and all marks/keys.
const punctuation = {39:"'",34:'"',160:' ',8216:'‘',8217:'’',8220:'“',8221:'”',8211:'–',8212:'—'};
export function normalizeArticleBody(content = []) {
  const normalized = content.flatMap(block => {
    if (!Array.isArray(block.children)) return [block];
    const rawImage = block.children.length === 1 && block.children[0]._type === 'span'
      && !block.children[0].marks?.length && /^!\((https:\/\/[^\s]+)\)$/.exec(block.children[0].text || '');
    if (rawImage) return [{...block, style: 'normal',
      children: [{...block.children[0], text: 'View referenced image', marks: ['image-reference']}],
      markDefs: [{_key: 'image-reference', _type: 'externalLink', href: rawImage[1]}],
    }];
    if (block.children.every(child => child._type === 'span' && !child.text?.trim())) return [];
    return [{...block, style: block.style === 'h1' ? 'h2' : block.style,
      children: block.children.map(child => child._type === 'span' ? {...child,
        // Decode known migration punctuation only; never interpret text as HTML.
        text: child.text?.replace(/&#(\d+);/g, (match, code) => punctuation[code] ?? match),
      } : child),
    }];
  });
  const text = block => block.children?.map(child => child.text || '').join('') || '';
  const cells = value => value.trim().slice(1, -1).split('|').map(cell => cell.trim());
  const plainRow = block => /^\|.*\|$/.test(text(block).trim()) && block.children?.every(child => child._type === 'span' && (child.marks || []).every(mark => ['strong', 'em'].includes(mark)));
  const result = [];
  for (let i = 0; i < normalized.length; i++) {
    const block = normalized[i];
    if (plainRow(block) && normalized[i + 1] && plainRow(normalized[i + 1]) && cells(text(normalized[i + 1])).every(cell => /^:?-{3,}:?$/.test(cell))) {
      const rows = [cells(text(block))];
      let end = i + 2;
      while (end < normalized.length && plainRow(normalized[end]) && cells(text(normalized[end])).length === rows[0].length) rows.push(cells(text(normalized[end++])));
      if (rows.length > 1 && cells(text(normalized[i + 1])).length === rows[0].length) {
        result.push({_type: 'articleTable', _key: block._key, rows});
        i = end - 1;
        continue;
      }
    }
    result.push(block);
  }
  return result;
}
