const fs = require('fs');

function parsePageContent(rawText, pageNum, workbookId) {
  const lines = rawText.split('\n');
  const blocks = [];
  let fieldIdx = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line contains inline blanks like: "May the Lord bless ________________ (NAME) and protect ____________."
    if (trimmed.includes('___')) {
      // Check if it is a purely blank line (multiline answer box)
      const nonUnderscore = trimmed.replace(/[_]/g, '').trim();
      if (nonUnderscore.length === 0 || nonUnderscore.length < 5 && /^[0-9.)\s]+$/.test(nonUnderscore)) {
        // Collect consecutive blank lines
        let blankCount = 1;
        while (i + 1 < lines.length && lines[i + 1].trim().replace(/[_]/g, '').trim().length === 0) {
          blankCount++;
          i++;
        }
        const fieldId = `${workbookId}_p${pageNum}_area_${fieldIdx++}`;
        blocks.push({
          type: 'multiline_blank',
          id: fieldId,
          linesCount: Math.min(Math.max(blankCount, 2), 6),
          placeholder: 'Write your notes / answer here...'
        });
        continue;
      }

      // Inline blank with text around it
      // Split line by underscore sequences
      const parts = [];
      const regex = /_{3,}(\s*\([A-Z0-9\s/]+\))?/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(trimmed)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', text: trimmed.substring(lastIndex, match.index) });
        }
        const hint = match[1] ? match[1].replace(/[()]/g, '').trim() : '';
        const fieldId = `${workbookId}_p${pageNum}_inline_${fieldIdx++}`;
        parts.push({
          type: 'inline_input',
          id: fieldId,
          hint: hint || 'fill in',
          length: Math.max(match[0].length, 12)
        });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < trimmed.length) {
        parts.push({ type: 'text', text: trimmed.substring(lastIndex) });
      }

      blocks.push({
        type: 'inline_blank_line',
        parts
      });
      continue;
    }

    // Header / Section check
    if (/^(Chapter\s+\d+|Part\s+\d+)/i.test(trimmed)) {
      blocks.push({ type: 'chapter_header', text: trimmed });
      continue;
    }

    if (/^(ACTION|DISCUSS|PRAYER|ACTIVITY|EXERCISE|INDIVIDUALLY|PRAY IN GROUPS)/i.test(trimmed)) {
      blocks.push({ type: 'activity_badge', text: trimmed });
      continue;
    }

    // Bullet points
    if (/^[•o-]\s+/.test(trimmed) || /^\d+\)\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      blocks.push({ type: 'bullet', text: trimmed });
      continue;
    }

    // Plain text / quote
    blocks.push({ type: 'paragraph', text: trimmed });
  }

  return blocks;
}

// Test on TMD Page 3 (Chapter 1)
const tmdRaw = JSON.parse(fs.readFileSync('src/data/tmd_mothers_pages.json', 'utf8'));
const parsedTmdP3 = parsePageContent(tmdRaw.pages[2].content, 3, 'tmd-mothers');
console.log('Parsed TMD Page 3:');
console.log(JSON.stringify(parsedTmdP3, null, 2));
