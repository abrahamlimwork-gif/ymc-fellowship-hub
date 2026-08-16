const fs = require('fs');

function parsePageToQuestions(rawText, pageNum, workbookId) {
  const lines = rawText.split('\n');
  const blocks = [];
  let fieldCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line contains underscores (blank line for writing)
    if (trimmed.includes('___')) {
      // Is it a multiline blank area (consecutive lines of underscores or standalone underscores)?
      const nonUnderscore = trimmed.replace(/[_]/g, '').trim();
      const isPureBlank = nonUnderscore.length === 0 || (/^[0-9.)\s]+$/.test(nonUnderscore));

      if (isPureBlank) {
        // Find the question/prompt above this blank
        let promptText = '';
        for (let j = i - 1; j >= 0; j--) {
          const prev = lines[j].trim();
          if (prev && !prev.includes('___') && !/^\d+$/.test(prev) && !/^Chapter\s+\d+/i.test(prev)) {
            promptText = prev;
            break;
          }
        }

        // Count how many consecutive blank lines
        let blankCount = 1;
        while (i + 1 < lines.length && lines[i + 1].trim().replace(/[_]/g, '').trim().length === 0) {
          blankCount++;
          i++;
        }

        const fieldId = `${workbookId}_p${pageNum}_q${fieldCounter++}`;
        blocks.push({
          type: 'question_box',
          id: fieldId,
          label: promptText || `Question / Prompt #${fieldCounter - 1}`,
          placeholder: 'Type your answer / notes here...',
          linesCount: Math.min(Math.max(blankCount, 2), 5)
        });
        continue;
      }

      // Inline blank line with text and blanks
      const parts = [];
      const regex = /_{3,}(\s*\([A-Za-z0-9\s/,'"-]+\))?/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(trimmed)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', text: trimmed.substring(lastIndex, match.index) });
        }
        const hint = match[1] ? match[1].replace(/[()]/g, '').trim() : '';
        const fieldId = `${workbookId}_p${pageNum}_inline_${fieldCounter++}`;
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
        parts,
        rawText: trimmed
      });
      continue;
    }

    // Check for discussion / action / prayer headers
    if (/^(ACTION|DISCUSS|PRAYER|ACTIVITY|EXERCISE|INDIVIDUALLY|PRAY IN GROUPS|PRAY IN PAIRS)/i.test(trimmed)) {
      blocks.push({ type: 'activity_badge', text: trimmed });
      continue;
    }

    // Check for chapter headers
    if (/^(Chapter\s+\d+|Part\s+\d+)/i.test(trimmed)) {
      blocks.push({ type: 'chapter_header', text: trimmed });
      continue;
    }

    // Check for bullet points
    if (/^[•o-]\s+/.test(trimmed) || /^\d+\)\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      blocks.push({ type: 'bullet', text: trimmed });
      continue;
    }

    // General text
    blocks.push({ type: 'paragraph', text: trimmed });
  }

  return blocks;
}

function processWorkbookWithQuestions(rawJsonPath, workbookId, title, subtitle) {
  const data = JSON.parse(fs.readFileSync(rawJsonPath, 'utf8'));
  const processedPages = data.pages.map((p) => {
    const blocks = parsePageToQuestions(p.content, p.pageNum, workbookId);
    
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

const mmProcessed = processWorkbookWithQuestions('src/data/master_mentor_pages.json', 'master-mentor', 'Master Mentor Workbook', 'TWNAF Leadership & Fatherhood Manual (May 2024)');
const tmdProcessed = processWorkbookWithQuestions('src/data/tmd_mothers_pages.json', 'tmd-mothers', 'TMD Mothers Workbook', 'A course for mothers in support of TWNAF (April 2024)');

fs.writeFileSync('src/data/master_mentor_full.json', JSON.stringify(mmProcessed, null, 2));
fs.writeFileSync('src/data/tmd_mothers_full.json', JSON.stringify(tmdProcessed, null, 2));

console.log('=== TEST PAGE 18 IN MM ===');
const p18 = mmProcessed.pages[17];
console.log(`Page 18 has ${p18.blocks.length} blocks:`);
p18.blocks.forEach((b, i) => console.log(`[${b.type}]`, b.label || b.text || b.rawText || b));
