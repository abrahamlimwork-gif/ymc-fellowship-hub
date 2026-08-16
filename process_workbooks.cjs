const fs = require('fs');

function processWorkbook(rawJsonPath, workbookId, title, subtitle) {
  const data = JSON.parse(fs.readFileSync(rawJsonPath, 'utf8'));
  const processedPages = data.pages.map((p, idx) => {
    const rawText = p.content;
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Detect chapter info
    let currentChapter = '';
    for (const l of lines) {
      if (/^Chapter\s+\d+/i.test(l)) {
        currentChapter = l;
        break;
      }
    }

    // Process interactive blocks and elements
    const elements = [];
    let currentBlock = null;
    let fieldCounter = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Is it a blank line?
      if (/_{3,}/.test(line)) {
        const fieldId = `${workbookId}_p${p.pageNum}_f${fieldCounter++}`;
        // Extract context prompt from previous line if applicable
        const prompt = (i > 0 && !lines[i-1].includes('___')) ? lines[i-1] : 'Fill in your answer / commitment:';
        
        elements.push({
          type: 'interactive_blank',
          id: fieldId,
          prompt: prompt,
          rawLine: line
        });
        continue;
      }

      // Is it Action / Discuss / Question?
      if (/^(ACTION|DISCUSS|QUESTION|PRAYER|ACTIVITY|EXERCISE)/i.test(line)) {
        elements.push({
          type: 'activity_header',
          tag: line.split(':')[0].trim(),
          text: line
        });
        continue;
      }

      // Is it Scripture quote?
      if (/^[“"].+[”"]/.test(line) || /^[A-Z0-9\s]+:\s*[“"]/.test(line) || /^(Eph\.|Phil\.|Prov\.|Num\.|Col\.|Mal\.|Josh\.|Matt\.|Luke|Heb\.)/i.test(line)) {
        elements.push({
          type: 'scripture',
          text: line
        });
        continue;
      }

      // Is it a Header?
      if (/^Chapter\s+\d+/i.test(line) || /^Part\s+\d+/i.test(line) || line.length < 50 && (/^[A-Z\s,–'-]{4,}$/.test(line) || /^[0-9]+\.\s+[A-Z]/.test(line))) {
        elements.push({
          type: 'heading',
          text: line
        });
        continue;
      }

      // Bullet point or normal text
      if (line.startsWith('•') || line.startsWith('o') || line.startsWith('-') || /^\d+\.\s+/.test(line)) {
        elements.push({
          type: 'bullet',
          text: line.replace(/^[•o-]\s*/, '')
        });
        continue;
      }

      // Default paragraph
      elements.push({
        type: 'paragraph',
        text: line
      });
    }

    return {
      pageNum: p.pageNum,
      title: lines[0] || `Page ${p.pageNum}`,
      chapter: currentChapter,
      rawText,
      elements
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
console.log('Successfully generated full verbatim workbook data files!');
