const fs = require('fs');

const mmData = JSON.parse(fs.readFileSync('src/data/master_mentor_pages.json', 'utf8'));

console.log('=== MASTER MENTOR PAGE SHEET MAPPING ===');
mmData.pages.forEach((p, idx) => {
  const lines = p.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const first3 = lines.slice(0, 3).join(' | ');
  const lastLine = lines[lines.length - 1];
  console.log(`PDF Sheet ${p.pageNum} (Index ${idx}): First: [${first3.substring(0, 60)}] Last: [${lastLine}]`);
});
