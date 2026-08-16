const fs = require('fs');
const mm = fs.readFileSync('scratch_Master_Mentor.txt', 'utf8');
const tmd = fs.readFileSync('scratch_TMD_Mothers.txt', 'utf8');

function summarizeSections(text, name) {
    console.log(`\n================== ${name} ==================`);
    const lines = text.split('\n');
    const chapters = [];
    lines.forEach((line, idx) => {
        if (/Chapter \d+/i.test(line) || /Part \d+/i.test(line) || /Section \d+/i.test(line)) {
            chapters.push(`Line ${idx+1}: ${line.trim()}`);
        }
    });
    console.log(chapters.slice(0, 30).join('\n'));
}

summarizeSections(mm, 'Master Mentor');
summarizeSections(tmd, 'TMD Mothers');
