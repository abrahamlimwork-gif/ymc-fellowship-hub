const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function compileHighResPDF() {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const width = 595.28;
  const height = 841.89;

  // Load generated images
  const baseDir = 'C:\\Users\\Khyle Alex\\.gemini\\antigravity\\brain\\1de87c3f-3cf5-4179-832e-7b7c326956c7';
  
  const coverBytes = fs.readFileSync(path.join(baseDir, 'ccf_secrets_cover_1787157633379.jpg'));
  const triangleBytes = fs.readFileSync(path.join(baseDir, 'marriage_triangle_diagram_1787247055596.jpg'));
  const pyramidBytes = fs.readFileSync(path.join(baseDir, 'priority_pyramid_diagram_1787247199800.jpg'));
  const covenantBytes = fs.readFileSync(path.join(baseDir, 'covenant_vs_contract_diagram_1787247249587.jpg'));

  const coverImg = await pdfDoc.embedJpg(coverBytes);
  const triangleImg = await pdfDoc.embedJpg(triangleBytes);
  const pyramidImg = await pdfDoc.embedJpg(pyramidBytes);
  const covenantImg = await pdfDoc.embedJpg(covenantBytes);

  // 1. COVER PAGE
  const page1 = pdfDoc.addPage([width, height]);
  page1.drawImage(coverImg, { x: 0, y: 0, width, height });

  // Secrets Data mapping to embedded images
  const secrets = [
    {
      num: 1,
      name: 'START',
      title: 'Pursuing God Together as One',
      scripture: '"A cord of three strands is not quickly broken." — Ecclesiastes 4:12',
      lesson: 'An awesome marriage begins with pursuing God first. As husband and wife individually draw closer to Christ, they naturally draw closer to each other.',
      img: triangleImg,
      questions: [
        '1. How would you describe your personal relationship with God right now?',
        '2. What is one practical habit (e.g. daily prayer together) you will start this week?'
      ]
    },
    {
      num: 2,
      name: 'STOP',
      title: 'Ending Marital Insanities & Past Hurts',
      scripture: '"Be quick to hear, slow to speak, slow to anger." — James 1:19',
      lesson: 'Marital insanity is repeating destructive habits and expecting intimacy. We must stop demanding perfection and instead extend Christ-like forgiveness.',
      img: null,
      questions: [
        '1. What recurring habit or tone of voice do you need to STOP in your marriage?',
        '2. Is there an unresolved hurt that you need to forgive and release to God today?'
      ]
    },
    {
      num: 3,
      name: 'CONNECT',
      title: 'The Art of Listening and Deep Presence',
      scripture: '"Count others more significant than yourselves." — Philippians 2:3',
      lesson: 'Connection requires undivided attention. In a busy digital age, couples must guard their daily conversational time to understand each other deeply.',
      img: null,
      questions: [
        '1. How many minutes of phone-free conversation do you have with your spouse daily?',
        '2. What makes your spouse feel most understood, respected, and appreciated?'
      ]
    },
    {
      num: 4,
      name: 'ENGAGE',
      title: 'How to Fight Right & Resolve Conflict',
      scripture: '"Bear with each other and forgive one another." — Colossians 3:13',
      lesson: 'Conflict in marriage is inevitable, but destruction is optional. When you fight against the problem together as teammates, conflict leads to deeper closeness.',
      img: null,
      questions: [
        '1. When disagreements happen, do you explode, withdraw, or talk calmly?',
        '2. What is one "Ground Rule" you both agree to follow during disagreements?'
      ]
    },
    {
      num: 5,
      name: 'BALANCE',
      title: 'Priorities, Boundaries and In-Laws',
      scripture: '"A man shall leave his father and mother and hold fast to his wife." — Genesis 2:24',
      lesson: 'Your spouse is your highest earthly priority—before career, children, in-laws, and hobbies. Boundaries protect your marital garden from outside weeds.',
      img: pyramidImg,
      questions: [
        '1. What area of life is currently taking too much time away from your spouse?',
        '2. What healthy boundary do you need to establish together this month?'
      ]
    },
    {
      num: 6,
      name: 'MINGLE',
      title: 'Romance, Dating, Fun & Physical Intimacy',
      scripture: '"Rejoice in the wife of your youth." — Proverbs 5:18',
      lesson: 'God designed marriage to be filled with romance, joy, and physical intimacy. Never stop courting and dating your spouse after marriage.',
      img: null,
      questions: [
        '1. Plan your next couple date this week. What intentional activity will you do?',
        '2. What is one creative way you can show romantic affection to your spouse today?'
      ]
    },
    {
      num: 7,
      name: 'FIGHT',
      title: 'Fighting FOR Your Marriage Covenant',
      scripture: '"Love bears all things, believes all things, endures all things." — 1 Cor 13:7',
      lesson: 'A biblical marriage is an unconditional covenant that never quits. When you choose to fight FOR each other, God’s grace restores and strengthens your home.',
      img: covenantImg,
      questions: [
        '1. What does "fighting for your marriage" mean to you in this current season?',
        '2. Write a short prayer of dedication and covenant commitment for your marriage.'
      ]
    }
  ];

  for (const s of secrets) {
    const page = pdfDoc.addPage([width, height]);

    // Top Header Banner
    page.drawRectangle({
      x: 36,
      y: height - 60,
      width: width - 72,
      height: 34,
      color: rgb(0.08, 0.14, 0.26),
      borderRadius: 4
    });

    page.drawText(`SECRET ${s.num}: ${s.name}`, {
      x: 48,
      y: height - 48,
      size: 13,
      font: fontBold,
      color: rgb(0.95, 0.75, 0.25)
    });

    page.drawText('CCF Across Couples Study', {
      x: width - 170,
      y: height - 47,
      size: 9,
      font: fontRegular,
      color: rgb(0.85, 0.9, 1)
    });

    // Chapter Title
    page.drawText(s.title, {
      x: 36,
      y: height - 88,
      size: 15,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25)
    });

    // Scripture Box
    page.drawRectangle({
      x: 36,
      y: height - 128,
      width: width - 72,
      height: 30,
      color: rgb(0.95, 0.97, 1),
      borderColor: rgb(0.7, 0.8, 0.95),
      borderWidth: 1
    });
    page.drawText(s.scripture, {
      x: 48,
      y: height - 116,
      size: 9,
      font: fontOblique,
      color: rgb(0.15, 0.25, 0.45)
    });

    // Teaching Paragraph
    page.drawText('BIBLICAL PRINCIPLE & ESSENCE', {
      x: 36,
      y: height - 148,
      size: 9.5,
      font: fontBold,
      color: rgb(0.7, 0.4, 0.1)
    });

    page.drawText(s.lesson, {
      x: 36,
      y: height - 165,
      size: 9,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
      maxWidth: width - 72,
      lineHeight: 13
    });

    // Embed High-Res Diagram if available
    let currentY = height - 195;
    if (s.img) {
      const imgWidth = 390;
      const imgHeight = 220;
      page.drawImage(s.img, {
        x: (width - imgWidth) / 2,
        y: currentY - imgHeight,
        width: imgWidth,
        height: imgHeight
      });
      currentY -= (imgHeight + 15);
    } else {
      currentY -= 15;
    }

    // Dgroup Questions & Fillable Lines
    page.drawText('DGROUP DISCUSSION & APPLICATION QUESTIONS', {
      x: 36,
      y: currentY,
      size: 10.5,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25)
    });

    currentY -= 20;

    for (const q of s.questions) {
      page.drawText(q, {
        x: 36,
        y: currentY,
        size: 9,
        font: fontBold,
        color: rgb(0.15, 0.2, 0.3),
        maxWidth: width - 72
      });
      currentY -= 18;

      for (let l = 0; l < 3; l++) {
        page.drawLine({
          start: { x: 36, y: currentY },
          end: { x: width - 36, y: currentY },
          thickness: 0.75,
          color: rgb(0.8, 0.85, 0.9)
        });
        currentY -= 18;
      }
      currentY -= 8;
    }

    // Footer Page Number
    page.drawText(`Page ${s.num + 1} of 8`, {
      x: width / 2 - 25,
      y: 24,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.65)
    });
  }

  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join(__dirname, 'public', 'pdfs', 'ccf_7_secrets.pdf');
  fs.writeFileSync(pdfPath, pdfBytes);
  console.log('✓ Compiled High-Res Graphic PDF:', pdfPath, 'Size:', (pdfBytes.length / 1024).toFixed(1), 'KB');
}

compileHighResPDF().catch(console.error);
