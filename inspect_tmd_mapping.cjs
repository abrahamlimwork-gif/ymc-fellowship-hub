const fs = require('fs');

const tmdData = JSON.parse(fs.readFileSync('src/data/tmd_mothers_pages.json', 'utf8'));

console.log('=== TMD MOTHERS PAGE SHEET MAPPING ===');
tmdData.pages.forEach((p, idx) => {
  const lines = p.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const first3 = lines.slice(0, 3).join(' | ');
  const lastLine = lines[lines.length - 1];
  console.log(`PDF Sheet ${p.pageNum} (Index ${idx}): First: [${first3.substring(0, 60)}] Last: [${lastLine}]`);
});
