const fs = require('fs');
const path = require('path');

async function extractCover(pdfPath, outPath, rotateDeg = 180) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const sharp = (await import('sharp')).default;

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const opList = await page.getOperatorList();

  console.log(`Page 1 in ${pdfPath} has ${opList.fnArray.length} operators`);
  
  // Find paintImageXObject ops
  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    // 85 is paintImageXObject or similar in pdfjs
    if (opList.argsArray[i] && opList.argsArray[i][0] && typeof opList.argsArray[i][0] === 'string' && opList.argsArray[i][0].startsWith('g_')) {
      const imgName = opList.argsArray[i][0];
      try {
        const imgObj = await new Promise((resolve) => {
          page.objs.get(imgName, (obj) => resolve(obj));
        });

        if (imgObj && imgObj.data) {
          console.log(`Found image: ${imgName}, width: ${imgObj.width}, height: ${imgObj.height}, kind: ${imgObj.kind}`);
          const channels = imgObj.data.length / (imgObj.width * imgObj.height);
          console.log(`Channels: ${channels}`);

          const rawBuffer = Buffer.from(imgObj.data);
          let sharpImg = sharp(rawBuffer, {
            raw: {
              width: imgObj.width,
              height: imgObj.height,
              channels: channels === 4 ? 4 : 3
            }
          });

          if (rotateDeg) {
            sharpImg = sharpImg.rotate(rotateDeg);
          }

          if (!fs.existsSync('public/covers')) {
            fs.mkdirSync('public/covers', { recursive: true });
          }

          await sharpImg.jpeg({ quality: 90 }).toFile(outPath);
          console.log(`Saved clean cover to ${outPath}!`);
          return true;
        }
      } catch (err) {
        console.error('Error extracting image:', err);
      }
    }
  }

  return false;
}

async function run() {
  await extractCover('public/pdfs/master_mentor.pdf', 'public/covers/master_mentor.jpg', 180);
  await extractCover('public/pdfs/tmd_mothers.pdf', 'public/covers/tmd_mothers.jpg', 180);
}

run().catch(console.error);
