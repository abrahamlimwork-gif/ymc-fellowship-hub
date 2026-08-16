const fs = require('fs');
const mm = fs.readFileSync('scratch_Master_Mentor.txt', 'utf8');
const tmd = fs.readFileSync('scratch_TMD_Mothers.txt', 'utf8');

function extractChapter(text, startTitle, endTitle) {
    const start = text.indexOf(startTitle);
    if (start === -1) return 'NOT FOUND: ' + startTitle;
    const end = endTitle ? text.indexOf(endTitle, start + startTitle.length) : text.length;
    return text.substring(start, end !== -1 ? end : start + 3000);
}

console.log("=== Master Mentor: Chapter 11 (What About Mom?) ===");
console.log(extractChapter(mm, 'Chapter 11', 'Chapter 12').substring(0, 3000));

console.log("\n=== TMD Mothers: Chapter 11 (The brilliant wife and mother) ===");
console.log(extractChapter(tmd, 'Chapter 11', 'Chapter 12').substring(0, 3000));
