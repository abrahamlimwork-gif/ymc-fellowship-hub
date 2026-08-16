const fs = require('fs');

const mm = JSON.parse(fs.readFileSync('src/data/master_mentor_full.json', 'utf8'));
const tmd = JSON.parse(fs.readFileSync('src/data/tmd_mothers_full.json', 'utf8'));

console.log('Master Mentor Pages with interactive blocks:');
mm.pages.forEach(p => {
  const interactives = p.blocks.filter(b => b.type === 'multiline_blank' || b.type === 'inline_blank_line');
  if (interactives.length > 0) {
    console.log(`Page ${p.pageNum} (${p.chapter || 'No chapter'}): ${interactives.length} interactive fields`);
  }
});

console.log('\nTMD Mothers Pages with interactive blocks:');
tmd.pages.forEach(p => {
  const interactives = p.blocks.filter(b => b.type === 'multiline_blank' || b.type === 'inline_blank_line');
  if (interactives.length > 0) {
    console.log(`Page ${p.pageNum} (${p.chapter || 'No chapter'}): ${interactives.length} interactive fields`);
  }
});
