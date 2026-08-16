const fs = require('fs');

async function extractCoverFromPage(pdfPath, outPath, rotateDeg = 180) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const sharp = (await import('sharp')).default;

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const opList = await page.getOperatorList();

  const imgName = opList.argsArray[2][0]; // 'img_p0_1'
  console.log(`Extracting ${imgName} from ${pdfPath}...`);

  const imgObj = await new Promise((resolve, reject) => {
    page.objs.get(imgName, (obj) => {
      if (obj) resolve(obj);
      else reject(new Error('Image obj not found'));
    });
  });

  console.log(`Image info: ${imgObj.width}x${imgObj.height}, kind: ${imgObj.kind}, data length: ${imgObj.data.length}`);

  const bytesPerPixel = imgObj.data.length / (imgObj.width * imgObj.height);
  console.log(`Bytes per pixel: ${bytesPerPixel}`);

  let sharpImg = sharp(Buffer.from(imgObj.data), {
    raw: {
      width: imgObj.width,
      height: imgObj.height,
      channels: Math.round(bytesPerPixel)
    }
  });

  if (rotateDeg) {
    sharpImg = sharpImg.rotate(rotateDeg);
  }

  // Resize to web-optimized thumbnail (width 400px)
  sharpImg = sharpImg.resize({ width: 400 });

  if (!fs.existsSync('public/covers')) {
    fs.mkdirSync('public/covers', { recursive: true });
  }

  await sharpImg.jpeg({ quality: 92 }).toFile(outPath);
  console.log(`✓ Successfully saved upright cover to ${outPath}!`);
}

async function run() {
  await extractCoverFromPage('public/pdfs/master_mentor.pdf', 'public/covers/master_mentor.jpg', 180);
  await extractCoverFromPage('public/pdfs/tmd_mothers.pdf', 'public/covers/tmd_mothers.jpg', 180);
}

run().catch(console.error);
