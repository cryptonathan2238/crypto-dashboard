// fetcher.js (Puppeteer screenshotter)
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function ensureDir(p) { await fs.promises.mkdir(p, { recursive: true }); }
async function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

async function screenshotAll(){
  const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls.json'), 'utf8'));
  await ensureDir(path.join(__dirname, 'public','images'));

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });

  for (const item of list){
    const page = await browser.newPage();
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 120000 });
      await wait(9000); // time for charts to render
      const out = path.join(__dirname, 'public','images', item.id + '.png');
      await page.screenshot({ path: out, fullPage: true });
      console.log('Saved', out);
    } catch (e) {
      console.error('Failed', item.id, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

async function main(){ await screenshotAll(); console.log('Screenshots done at', new Date().toISOString()); }
if (require.main === module){ main(); }
