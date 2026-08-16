const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractPages(filePath, outJsonPath) {
    console.log(`Extracting pages from ${filePath}...`);
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    await parser.load();
    const info = await parser.getInfo();
    console.log(`Total pages: ${info.total}`);
    
    // Let's get text page by page if available or split full text
    const textResult = await parser.getText();
    const fullText = typeof textResult === 'string' ? textResult : (textResult.text || '');
    
    // Split by page markers like "-- X of Y --"
    const pageChunks = fullText.split(/--\s*(\d+)\s+of\s+\d+\s*--/g);
    console.log(`Page chunks length: ${pageChunks.length}`);
    
    const pages = [];
    if (pageChunks.length > 1) {
        for (let i = 1; i < pageChunks.length; i += 2) {
            const pageNum = parseInt(pageChunks[i], 10);
            const content = pageChunks[i + 1] ? pageChunks[i + 1].trim() : '';
            pages.push({
                pageNum,
                content
            });
        }
    }
    
    console.log(`Parsed ${pages.length} pages.`);
    fs.writeFileSync(outJsonPath, JSON.stringify({ totalPages: info.total, pages }, null, 2));
    console.log(`Saved to ${outJsonPath}`);
}

async function run() {
    await extractPages('C:\\Users\\Khyle Alex\\Desktop\\TWNAF\\Master Mentor Workbook - May 2024.pdf', 'master_mentor_pages.json');
    await extractPages('C:\\Users\\Khyle Alex\\Desktop\\TWNAF\\TMD Mothers Workbook - April 2024.pdf', 'tmd_mothers_pages.json');
}

run();
