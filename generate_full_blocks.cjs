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
      if (nonUnderscore.length === 0 || (nonUnderscore.length < 5 && /^[0-9.)\s]+$/.test(nonUnderscore))) {
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
          placeholder: 'Write your notes / answers here...'
        });
        continue;
      }

      // Inline blank with text around it
      const parts = [];
      const regex = /_{3,}(\s*\([A-Za-z0-9\s/,'"-]+\))?/g;
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
          hint: hint || 'write here',
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

    if (/^(ACTION|DISCUSS|PRAYER|ACTIVITY|EXERCISE|INDIVIDUALLY|PRAY IN GROUPS|PRAY IN PAIRS)/i.test(trimmed)) {
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

function processWorkbook(rawJsonPath, workbookId, title, subtitle) {
  const data = JSON.parse(fs.readFileSync(rawJsonPath, 'utf8'));
  const processedPages = data.pages.map((p) => {
    const blocks = parsePageContent(p.content, p.pageNum, workbookId);
    
    // Find chapter info if present
    let currentChapter = '';
    for (const b of blocks) {
      if (b.type === 'chapter_header') {
        currentChapter = b.text;
        break;
      }
    }

    return {
      pageNum: p.pageNum,
      title: `Page ${p.pageNum}`,
      chapter: currentChapter,
      rawText: p.content,
      blocks
    };
  });

  return {
    id: workbookId,
    title,
    subtitle,
    totalPages: processedPages.length,
    pages: processedPages
  };
}

const mmProcessed = processWorkbook('src/data/master_mentor_pages.json', 'master-mentor', 'Master Mentor Workbook', 'TWNAF Leadership & Fatherhood Manual (May 2024)');
const tmdProcessed = processWorkbook('src/data/tmd_mothers_pages.json', 'tmd-mothers', 'TMD Mothers Workbook', 'A course for mothers in support of TWNAF (April 2024)');

fs.writeFileSync('src/data/master_mentor_full.json', JSON.stringify(mmProcessed, null, 2));
fs.writeFileSync('src/data/tmd_mothers_full.json', JSON.stringify(tmdProcessed, null, 2));
console.log('Regenerated master_mentor_full.json and tmd_mothers_full.json successfully!');
