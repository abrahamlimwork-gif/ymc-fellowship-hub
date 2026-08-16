const fs = require('fs');
const mm = fs.readFileSync('scratch_Master_Mentor.txt', 'utf8');
const tmd = fs.readFileSync('scratch_TMD_Mothers.txt', 'utf8');

function findChapterContent(text, chStr) {
    const idxs = [];
    let pos = 0;
    while ((pos = text.indexOf(chStr, pos)) !== -1) {
        idxs.push(pos);
        pos += chStr.length;
    }
    return idxs.map(i => text.substring(i, i + 2500));
}

console.log("=== MASTER MENTOR CH 11 ===");
findChapterContent(mm, "Chapter 11").forEach((snippet, i) => {
    console.log(`\n--- Instance ${i+1} ---\n`, snippet);
});

console.log("\n=== TMD MOTHERS CH 11 ===");
findChapterContent(tmd, "Chapter 11").forEach((snippet, i) => {
    console.log(`\n--- Instance ${i+1} ---\n`, snippet);
});
