const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function inspect(filePath, name) {
    console.log(`\n========================================`);
    console.log(`=== Inspecting ${name} ===`);
    console.log(`========================================`);
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        await parser.load();
        const info = await parser.getInfo();
        const textResult = await parser.getText();
        console.log(`Total Pages: ${info.total || info.numpages || 'unknown'}`);
        console.log(`Info:`, JSON.stringify(info, null, 2));
        
        const fullText = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult));
        console.log(`\n--- First 1500 characters ---`);
        console.log(fullText.substring(0, 1500));
        
        fs.writeFileSync(`scratch_${name}.txt`, fullText);
        console.log(`\nSuccessfully written scratch_${name}.txt (Total length: ${fullText.length} chars)`);
    } catch (err) {
        console.error(`Error reading ${name}:`, err);
    }
}

async function run() {
    await inspect('C:\\Users\\Khyle Alex\\Desktop\\TWNAF\\Master Mentor Workbook - May 2024.pdf', 'Master_Mentor');
    await inspect('C:\\Users\\Khyle Alex\\Desktop\\TWNAF\\TMD Mothers Workbook - April 2024.pdf', 'TMD_Mothers');
}

run();
