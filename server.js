import express from 'express';
import multer from 'multer';
import puppeteer from 'puppeteer';
import fs from 'fs';

const app = express();
const upload = multer({ dest: '/tmp/' });

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    fs.unlinkSync(filePath);

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // ✅ Emula tela real com largura ideal para layout responsivo
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await page.emulateMediaType('screen');

    await page.setContent(htmlContent, { timeout: 70000, waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'preview.png', fullPage: true });

    // ✅ Gera PDF com o layout igual à tela renderizada
    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: '1200px',
      preferCSSPageSize: false
    });


    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar PDF');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
