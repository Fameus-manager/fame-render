const express    = require('express');
const puppeteer  = require('puppeteer');
const ffmpeg     = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(express.json());

app.get('/health', (_, res) => res.send('OK'));

app.post('/screenshot', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page    = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const png64   = await page.screenshot({ encoding: 'base64' });
  await browser.close();

  res.json({ screenshot: png64 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening on', PORT));
