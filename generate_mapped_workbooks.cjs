const fs = require('fs');

function parsePageToQuestions(rawText, sheetNum, printedPageNum, workbookId) {
  const lines = rawText.split('\n');
  const blocks = [];
  let fieldCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line contains underscores (blank line for writing)
    if (trimmed.includes('___')) {
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

        const fieldId = `${workbookId}_sheet${sheetNum}_q${fieldCounter++}`;
        blocks.push({
          type: 'question_box',
          id: fieldId,
          label: promptText || `Prompt #${fieldCounter - 1}`,
          placeholder: 'Type your answer or reflection here...',
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
        const fieldId = `${workbookId}_sheet${sheetNum}_inline_${fieldCounter++}`;
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

    if (/^(ACTION|DISCUSS|PRAYER|ACTIVITY|EXERCISE|INDIVIDUALLY|PRAY IN GROUPS|PRAY IN PAIRS)/i.test(trimmed)) {
      blocks.push({ type: 'activity_badge', text: trimmed });
      continue;
    }

    if (/^(Chapter\s+\d+|Part\s+\d+)/i.test(trimmed)) {
      blocks.push({ type: 'chapter_header', text: trimmed });
      continue;
    }

    if (/^[•o-]\s+/.test(trimmed) || /^\d+\)\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      blocks.push({ type: 'bullet', text: trimmed });
      continue;
    }

    blocks.push({ type: 'paragraph', text: trimmed });
  }

  return blocks;
}

// Master Mentor Mapping
const mmRaw = JSON.parse(fs.readFileSync('src/data/master_mentor_pages.json', 'utf8'));
const mmPages = mmRaw.pages.map((p) => {
  const sheetNum = p.pageNum; // 1 to 89 in PDF
  let printedPageNum = null;
  let displayLabel = `Sheet ${sheetNum}`;

  // In MM: Sheet 1 is Table of Contents. Sheet 2 is Printed Page 1. Sheet 18 is Printed Page 17.
  if (sheetNum === 1) {
    displayLabel = 'Table of Contents';
    printedPageNum = 0;
  } else if (sheetNum <= 87) {
    printedPageNum = sheetNum - 1;
    displayLabel = `Page ${printedPageNum}`;
  } else {
    displayLabel = `Back Cover ${sheetNum - 87}`;
  }

  const blocks = parsePageToQuestions(p.content, sheetNum, printedPageNum, 'master-mentor');
  let currentChapter = '';
  for (const b of blocks) {
    if (b.type === 'chapter_header') {
      currentChapter = b.text;
      break;
    }
  }

  return {
    sheetNum,
    pageNum: sheetNum, // used by PDF.js getPage(sheetNum)
    printedPage: printedPageNum,
    displayLabel,
    title: displayLabel,
    chapter: currentChapter,
    rawText: p.content,
    blocks
  };
});

const mmFull = {
  id: 'master-mentor',
  title: 'Master Mentor Workbook',
  subtitle: 'TWNAF Leadership & Fatherhood Manual (May 2024)',
  totalPages: mmPages.length,
  coverOffset: 1, // printedPage = sheetNum - 1
  pages: mmPages
};

// TMD Mothers Mapping
const tmdRaw = JSON.parse(fs.readFileSync('src/data/tmd_mothers_pages.json', 'utf8'));
const tmdPages = tmdRaw.pages.map((p) => {
  const sheetNum = p.pageNum; // 1 to 107 in PDF
  let printedPageNum = null;
  let displayLabel = `Sheet ${sheetNum}`;

  // In TMD: Sheet 1 is Cover. Sheet 2 is TOC. Sheet 3 is Printed Page 1.
  if (sheetNum === 1) {
    displayLabel = 'Cover Page';
    printedPageNum = 0;
  } else if (sheetNum === 2) {
    displayLabel = 'Table of Contents';
    printedPageNum = 0;
  } else if (sheetNum <= 105) {
    printedPageNum = sheetNum - 2;
    displayLabel = `Page ${printedPageNum}`;
  } else {
    displayLabel = `Back Cover ${sheetNum - 105}`;
  }

  const blocks = parsePageToQuestions(p.content, sheetNum, printedPageNum, 'tmd-mothers');
  let currentChapter = '';
  for (const b of blocks) {
    if (b.type === 'chapter_header') {
      currentChapter = b.text;
      break;
    }
  }

  return {
    sheetNum,
    pageNum: sheetNum,
    printedPage: printedPageNum,
    displayLabel,
    title: displayLabel,
    chapter: currentChapter,
    rawText: p.content,
    blocks
  };
});

const tmdFull = {
  id: 'tmd-mothers',
  title: 'TMD Mothers Workbook',
  subtitle: 'A course for mothers in support of TWNAF (April 2024)',
  totalPages: tmdPages.length,
  coverOffset: 2, // printedPage = sheetNum - 2
  pages: tmdPages
};

fs.writeFileSync('src/data/master_mentor_full.json', JSON.stringify(mmFull, null, 2));
fs.writeFileSync('src/data/tmd_mothers_full.json', JSON.stringify(tmdFull, null, 2));
console.log('Successfully generated mapped workbooks with exact printed pages & PDF sheet numbers!');
