const fs = require('fs');
const tmd = fs.readFileSync('scratch_TMD_Mothers.txt', 'utf8');
const mm = fs.readFileSync('scratch_Master_Mentor.txt', 'utf8');

// Print TMD Chapter 11 full text
const ch11_start = tmd.indexOf('Chapter 11\n\tThe brilliant wife and mother') !== -1 
    ? tmd.indexOf('Chapter 11\n\tThe brilliant wife and mother')
    : tmd.indexOf('Chapter 11\r\n\tThe brilliant wife and mother');

const ch11_idx = ch11_start !== -1 ? ch11_start : tmd.lastIndexOf('Chapter 11');
console.log('TMD Ch 11 length approx:');
console.log(tmd.substring(ch11_idx, ch11_idx + 8000));

console.log('\n================ MM Chapter 11 ================\n');
const mm11_idx = mm.lastIndexOf('Chapter 11');
console.log(mm.substring(mm11_idx, mm11_idx + 4000));
