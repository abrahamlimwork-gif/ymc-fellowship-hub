const fs = require('fs');
const mm = fs.readFileSync('scratch_Master_Mentor.txt', 'utf8');
const tmd = fs.readFileSync('scratch_TMD_Mothers.txt', 'utf8');

function extractActivities(text, name) {
    console.log(`\n================== ACTIVITIES IN ${name} ==================`);
    const lines = text.split('\n');
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('ACTION') || line.startsWith('DISCUSS') || line.startsWith('QUESTION') || line.includes('______') || line.startsWith('PRAYER')) {
            console.log(`Line ${i+1}: [${line}]`);
            // print next 4 lines
            for (let j = 1; j <= 4 && i + j < lines.length; j++) {
                if (lines[i+j].trim()) console.log(`   > ${lines[i+j].trim()}`);
            }
            count++;
            if (count >= 15) break;
        }
    }
}

extractActivities(mm, 'Master Mentor');
extractActivities(tmd, 'TMD Mothers');
