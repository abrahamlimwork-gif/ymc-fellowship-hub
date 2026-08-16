const fs = require('fs');

const mmRaw = JSON.parse(fs.readFileSync('src/data/master_mentor_pages.json', 'utf8'));
const tmdRaw = JSON.parse(fs.readFileSync('src/data/tmd_mothers_pages.json', 'utf8'));

console.log('=== MASTER MENTOR PAGE 1 TO 6 ===');
for (let i = 0; i < 6; i++) {
  console.log(`\n--- Page ${mmRaw.pages[i].pageNum} ---`);
  console.log(mmRaw.pages[i].content);
}

console.log('\n=== TMD MOTHERS PAGE 1 TO 6 ===');
for (let i = 0; i < 6; i++) {
  console.log(`\n--- Page ${tmdRaw.pages[i].pageNum} ---`);
  console.log(tmdRaw.pages[i].content);
}
