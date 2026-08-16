const fs = require('fs');

async function extractWorkbookDirectly(pdfPath, workbookId, title, subtitle) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;

  console.log(`Extracting ${workbookId}: ${doc.numPages} pages...`);
  const pages = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items into lines based on transform Y
    const items = textContent.items;
    let linesMap = new Map();

    for (const item of items) {
      if (!item.str) continue;
      const y = Math.round(item.transform[5]);
      if (!linesMap.has(y)) {
        linesMap.set(y, []);
      }
      linesMap.get(y).push(item);
    }

    // Sort Y descending (top to bottom)
    const sortedYs = Array.from(linesMap.keys()).sort((a, b) => b - a);
    const rawLines = [];

    for (const y of sortedYs) {
      const rowItems = linesMap.get(y).sort((a, b) => a.transform[4] - b.transform[4]);
      const lineStr = rowItems.map(it => it.str).join(' ').trim();
      if (lineStr) rawLines.push(lineStr);
    }

    const fullText = rawLines.join('\n');

    // Detect printed page number from text (e.g. leading number or trailing number)
    let printedPage = null;
    if (rawLines.length > 0) {
      const firstLine = rawLines[0];
      const lastLine = rawLines[rawLines.length - 1];
      if (/^\d{1,3}$/.test(firstLine)) {
        printedPage = parseInt(firstLine, 10);
      } else if (/^\d{1,3}$/.test(lastLine)) {
        printedPage = parseInt(lastLine, 10);
      }
    }

    // Parse questions for this exact PDF page
    const blocks = parseBlocksFromLines(rawLines, pageNum, workbookId);

    let chapterHeader = '';
    for (const b of blocks) {
      if (b.type === 'chapter_header') {
        chapterHeader = b.text;
        break;
      }
    }

    let displayLabel = `Sheet ${pageNum}`;
    if (printedPage !== null) {
      displayLabel = `Page ${printedPage}`;
    } else if (pageNum === 1) {
      displayLabel = 'Cover';
    } else if (pageNum === 2 && workbookId === 'master-mentor') {
      displayLabel = 'TOC';
    } else if (pageNum <= 3 && workbookId === 'tmd-mothers') {
      displayLabel = pageNum === 2 ? 'Intro' : 'TOC';
    }

    pages.push({
      sheetNum: pageNum,
      pageNum: pageNum, // PDF.js getPage(pageNum)
      printedPage: printedPage,
      displayLabel,
      title: displayLabel,
      chapter: chapterHeader,
      rawText: fullText,
      blocks
    });
  }

  return {
    id: workbookId,
    title,
    subtitle,
    totalPages: pages.length,
    pages
  };
}

function parseBlocksFromLines(lines, pageNum, workbookId) {
  const blocks = [];
  let fieldCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    // Check if line contains blank underscores
    if (trimmed.includes('___') || trimmed.includes('…') || /\.{4,}/.test(trimmed)) {
      const nonUnderscore = trimmed.replace(/[_….]/g, '').trim();
      const isPureBlank = nonUnderscore.length === 0 || (/^[0-9.)\s]+$/.test(nonUnderscore));

      if (isPureBlank) {
        let promptText = '';
        for (let j = i - 1; j >= 0; j--) {
          const prev = lines[j].trim();
          if (prev && !prev.includes('___') && !/^\d+$/.test(prev) && !/^Chapter\s+\d+/i.test(prev)) {
            promptText = prev;
            break;
          }
        }

        let blankCount = 1;
        while (i + 1 < lines.length && lines[i + 1].trim().replace(/[_….]/g, '').trim().length === 0) {
          blankCount++;
          i++;
        }

        const fieldId = `${workbookId}_p${pageNum}_q${fieldCounter++}`;
        blocks.push({
          type: 'question_box',
          id: fieldId,
          label: promptText || `Question / Prompt #${fieldCounter - 1}`,
          placeholder: 'Type your answer or reflection here...',
          linesCount: Math.min(Math.max(blankCount, 2), 5)
        });
        continue;
      }

      // Inline blank line
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

    if (/^(Chapter\s+\d+|Part\s+\d+)/i.test(trimmed)) {
      blocks.push({ type: 'chapter_header', text: trimmed });
      continue;
    }

    if (/^(ACTION|DISCUSS|PRAYER|ACTIVITY|EXERCISE|INDIVIDUALLY|PRAY IN GROUPS|PRAY IN PAIRS)/i.test(trimmed)) {
      blocks.push({ type: 'activity_badge', text: trimmed });
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

async function run() {
  const mm = await extractWorkbookDirectly('public/pdfs/master_mentor.pdf', 'master-mentor', 'Master Mentor Workbook', 'TWNAF Leadership & Fatherhood Manual (May 2024)');
  const tmd = await extractWorkbookDirectly('public/pdfs/tmd_mothers.pdf', 'tmd-mothers', 'TMD Mothers Workbook', 'A course for mothers in support of TWNAF (April 2024)');

  fs.writeFileSync('src/data/master_mentor_full.json', JSON.stringify(mm, null, 2));
  fs.writeFileSync('src/data/tmd_mothers_full.json', JSON.stringify(tmd, null, 2));

  console.log('\n=== TEST MM PDF PAGE 19 (Chapter 4) ===');
  const mmPage19 = mm.pages.find(p => p.sheetNum === 19);
  console.log('Sheet 19 Label:', mmPage19.displayLabel);
  console.log('Chapter:', mmPage19.chapter);
  const qList = mmPage19.blocks.filter(b => b.type === 'question_box');
  console.log(`Found ${qList.length} questions on PDF Page 19:`);
  qList.forEach((q, i) => console.log(`Q${i+1}: ${q.label}`));

  console.log('\n=== TEST MM PDF PAGE 20 ===');
  const mmPage20 = mm.pages.find(p => p.sheetNum === 20);
  console.log('Sheet 20 Label:', mmPage20.displayLabel);
  const qList20 = mmPage20.blocks.filter(b => b.type === 'question_box');
  console.log(`Found ${qList20.length} questions on PDF Page 20:`);
  qList20.forEach((q, i) => console.log(`Q${i+1}: ${q.label}`));
}

run().catch(console.error);
