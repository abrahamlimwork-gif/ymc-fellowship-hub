const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createCCFSecretsPDF() {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // A4 Size: 595.28 x 841.89 points
  const width = 595.28;
  const height = 841.89;

  // -------------------------------------------------------------
  // PAGE 1: COVER PAGE
  // -------------------------------------------------------------
  const coverPage = pdfDoc.addPage([width, height]);
  
  // Background gradient-like blocks
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: height,
    color: rgb(0.08, 0.12, 0.22) // Deep Navy
  });

  coverPage.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.85, 0.65, 0.2), // Gold border
    borderWidth: 2,
    color: rgb(0.1, 0.16, 0.28)
  });

  // Top Badge
  coverPage.drawRectangle({
    x: width / 2 - 140,
    y: height - 120,
    width: 280,
    height: 32,
    color: rgb(0.85, 0.65, 0.2),
    borderRadius: 6
  });
  coverPage.drawText('CCF ACROSS FAMILY MINISTRY', {
    x: width / 2 - 118,
    y: height - 108,
    size: 12,
    font: fontBold,
    color: rgb(0.08, 0.12, 0.22)
  });

  // Main Title
  coverPage.drawText('7 SECRETS', {
    x: width / 2 - 125,
    y: height - 240,
    size: 38,
    font: fontBold,
    color: rgb(0.95, 0.75, 0.25)
  });

  coverPage.drawText('TO AN AWESOME', {
    x: width / 2 - 150,
    y: height - 285,
    size: 28,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  coverPage.drawText('MARRIAGE', {
    x: width / 2 - 120,
    y: height - 335,
    size: 36,
    font: fontBold,
    color: rgb(0.95, 0.75, 0.25)
  });

  // Center Emblem Box
  coverPage.drawRectangle({
    x: width / 2 - 120,
    y: height - 510,
    width: 240,
    height: 120,
    color: rgb(0.15, 0.22, 0.38),
    borderColor: rgb(0.85, 0.65, 0.2),
    borderWidth: 1.5
  });

  coverPage.drawText('COUPLES DGROUP WORKBOOK', {
    x: width / 2 - 100,
    y: height - 440,
    size: 12,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  coverPage.drawText('Interactive Study, Reflection & Action Guide', {
    x: width / 2 - 110,
    y: height - 465,
    size: 10,
    font: fontRegular,
    color: rgb(0.8, 0.85, 0.95)
  });

  // Subtitle / Footer
  coverPage.drawText('A Christ-Centered Guide for Husbands and Wives', {
    x: width / 2 - 145,
    y: 110,
    size: 13,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  coverPage.drawText('Every Family a Discipleship Group (EFAD)', {
    x: width / 2 - 120,
    y: 80,
    size: 11,
    font: fontOblique,
    color: rgb(0.85, 0.65, 0.2)
  });

  // -------------------------------------------------------------
  // SECRETS 1 TO 7 DATA
  // -------------------------------------------------------------
  const secrets = [
    {
      num: 1,
      name: 'START',
      title: 'Pursuing God Together as One',
      scripture: '"A cord of three strands is not quickly broken." — Ecclesiastes 4:12',
      diagram: [
        '               [ GOD AT THE CENTER ]               ',
        '                      /     \\                      ',
        '                     /       \\                     ',
        '       [ HUSBAND ] <-----------> [ WIFE ]          ',
        '   (As both draw closer to God, they draw closer)   '
      ],
      lesson: 'An awesome marriage begins with pursuing God first. When both husband and wife surrender their lives to Christ, their marriage is anchored on an unshakeable foundation.',
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
      diagram: [
        '    [ OLD CYCLE ] : Trigger -> Blame -> Stonewall -> Distance     ',
        '    [ GRACE CYCLE]: Trigger -> Listen -> Forgive  -> Intimacy     '
      ],
      lesson: 'Marital insanity is repeating destructive habits and expecting intimacy. We must stop demanding our spouse to be perfect and instead extend Christ-like forgiveness.',
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
      diagram: [
        '   [ ROOMMATES ] : Passing through, distracted by phones/work    ',
        '   [ SOULMATES ] : 15+ mins daily distraction-free eye contact   '
      ],
      lesson: 'Connection requires undivided attention. In a busy digital age, couples must guard their daily conversational time to understand each other deeply.',
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
      diagram: [
        '   [ ATTACK PROBLEM ]  vs  [ NEVER ATTACK SPOUSE ]               ',
        '   Rule 1: Stick to issue    | Rule 2: No "Always" or "Never"     ',
        '   Rule 3: Fight as teammates fighting for reconciliation!       '
      ],
      lesson: 'Conflict in marriage is inevitable, but destruction is optional. When you fight against the problem together as teammates, conflict leads to deeper closeness.',
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
      diagram: [
        '   [ PRIORITY PYRAMID ]:  1. GOD  ->  2. SPOUSE  ->  3. KIDS  ->  4. WORK/OTHERS   '
      ],
      lesson: 'Your spouse is your highest earthly priority—before career, children, in-laws, and hobbies. Boundaries protect your marital garden from outside weeds.',
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
      diagram: [
        '   [ DATING WHEEL ]: Weekly Dates + Words of Praise + Physical Affection   '
      ],
      lesson: 'God designed marriage to be filled with romance, joy, and physical intimacy. Never stop courting and dating your spouse after marriage.',
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
      diagram: [
        '   [ CONTRACT ]: "I do my part IF you do yours" (50/50 Conditional)  ',
        '   [ COVENANT ]: "I give 100% unconditional love as Christ gave"     '
      ],
      lesson: 'A biblical marriage is an unconditional covenant that never quits. When you choose to fight FOR each other, God’s grace restores and strengthens your home.',
      questions: [
        '1. What does "fighting for your marriage" mean to you in this current season?',
        '2. Write a short prayer of dedication and covenant commitment for your marriage.'
      ]
    }
  ];

  // -------------------------------------------------------------
  // CREATE PAGES FOR EACH SECRET
  // -------------------------------------------------------------
  for (const s of secrets) {
    const page = pdfDoc.addPage([width, height]);

    // Top Header Banner
    page.drawRectangle({
      x: 36,
      y: height - 70,
      width: width - 72,
      height: 38,
      color: rgb(0.1, 0.16, 0.28),
      borderRadius: 4
    });

    page.drawText(`SECRET ${s.num}: ${s.name}`, {
      x: 50,
      y: height - 56,
      size: 14,
      font: fontBold,
      color: rgb(0.95, 0.75, 0.25)
    });

    page.drawText('CCF Across Couples Study', {
      x: width - 180,
      y: height - 54,
      size: 9,
      font: fontRegular,
      color: rgb(0.85, 0.9, 1)
    });

    // Chapter Title
    page.drawText(s.title, {
      x: 36,
      y: height - 100,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25)
    });

    // Scripture Box
    page.drawRectangle({
      x: 36,
      y: height - 145,
      width: width - 72,
      height: 34,
      color: rgb(0.95, 0.97, 1),
      borderColor: rgb(0.7, 0.8, 0.95),
      borderWidth: 1
    });
    page.drawText(s.scripture, {
      x: 48,
      y: height - 132,
      size: 9.5,
      font: fontOblique,
      color: rgb(0.15, 0.25, 0.45)
    });

    // Teaching Paragraph
    page.drawText('BIBLICAL FOUNDATION & ESSENCE', {
      x: 36,
      y: height - 168,
      size: 10,
      font: fontBold,
      color: rgb(0.7, 0.4, 0.1)
    });

    page.drawText(s.lesson, {
      x: 36,
      y: height - 188,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.35),
      maxWidth: width - 72,
      lineHeight: 14
    });

    // Visual Diagram Box
    page.drawRectangle({
      x: 36,
      y: height - 330,
      width: width - 72,
      height: 110,
      color: rgb(0.97, 0.98, 0.99),
      borderColor: rgb(0.2, 0.35, 0.55),
      borderWidth: 1.5
    });

    page.drawText('CONCEPT DIAGRAM / FRAMEWORK', {
      x: 48,
      y: height - 238,
      size: 9,
      font: fontBold,
      color: rgb(0.2, 0.35, 0.55)
    });

    let diagY = height - 260;
    for (const dLine of s.diagram) {
      page.drawText(dLine, {
        x: 52,
        y: diagY,
        size: 8.5,
        font: fontRegular,
        color: rgb(0.1, 0.2, 0.3)
      });
      diagY -= 13;
    }

    // Dgroup Questions & Fillable Lines
    page.drawText('DGROUP DISCUSSION & APPLICATION QUESTIONS', {
      x: 36,
      y: height - 360,
      size: 11,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25)
    });

    let qY = height - 385;
    for (const q of s.questions) {
      page.drawText(q, {
        x: 36,
        y: qY,
        size: 9.5,
        font: fontBold,
        color: rgb(0.15, 0.2, 0.3),
        maxWidth: width - 72
      });
      qY -= 22;

      // Draw dotted lines for fillable writing
      for (let l = 0; l < 4; l++) {
        page.drawLine({
          start: { x: 36, y: qY },
          end: { x: width - 36, y: qY },
          thickness: 0.75,
          color: rgb(0.8, 0.85, 0.9)
        });
        qY -= 20;
      }
      qY -= 12;
    }

    // Footer Page Number
    page.drawText(`Page ${s.num + 1} of 8`, {
      x: width / 2 - 25,
      y: 28,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.65)
    });
  }

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join(__dirname, 'public', 'pdfs', 'ccf_7_secrets.pdf');
  fs.writeFileSync(pdfPath, pdfBytes);
  console.log('✓ Created PDF:', pdfPath, 'Size:', (pdfBytes.length / 1024).toFixed(1), 'KB');

  // Generate Cover JPEG
  const coverSvg = `
  <svg width="400" height="580" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
    </defs>
    <rect width="400" height="580" fill="url(#bg)" rx="8" />
    <rect x="16" y="16" width="368" height="548" fill="none" stroke="url(#gold)" stroke-width="2" rx="6" />
    
    <rect x="60" y="50" width="280" height="32" fill="url(#gold)" rx="4" />
    <text x="200" y="71" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#0f172a" text-anchor="middle">CCF ACROSS FAMILY MINISTRY</text>
    
    <text x="200" y="180" font-family="Arial, sans-serif" font-weight="bold" font-size="34" fill="#fbbf24" text-anchor="middle">7 SECRETS</text>
    <text x="200" y="225" font-family="Arial, sans-serif" font-weight="bold" font-size="24" fill="#ffffff" text-anchor="middle">TO AN AWESOME</text>
    <text x="200" y="270" font-family="Arial, sans-serif" font-weight="bold" font-size="32" fill="#fbbf24" text-anchor="middle">MARRIAGE</text>
    
    <rect x="50" y="320" width="300" height="90" fill="#1e293b" stroke="url(#gold)" stroke-width="1.5" rx="6" />
    <text x="200" y="355" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#ffffff" text-anchor="middle">COUPLES DGROUP WORKBOOK</text>
    <text x="200" y="380" font-family="Arial, sans-serif" font-size="11" fill="#cbd5e1" text-anchor="middle">Reflection, Intimacy &amp; Action Guide</text>
    
    <text x="200" y="475" font-family="Arial, sans-serif" font-weight="bold" font-size="13" fill="#ffffff" text-anchor="middle">Every Family a Discipleship Group</text>
    <text x="200" y="505" font-family="Arial, sans-serif" font-size="11" fill="#fbbf24" text-anchor="middle">Christ-Centered Marriage Study</text>
  </svg>
  `;

  const coverJpgPath = path.join(__dirname, 'public', 'covers', 'ccf_7_secrets.jpg');
  await sharp(Buffer.from(coverSvg))
    .jpeg({ quality: 95 })
    .toFile(coverJpgPath);
  console.log('✓ Generated Cover JPEG:', coverJpgPath);
}

createCCFSecretsPDF().catch(console.error);
