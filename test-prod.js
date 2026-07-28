import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3001');
  await new Promise(r => setTimeout(r, 1000));
  const html = await page.content();
  console.log('HTML length:', html.length);
  console.log('Includes DailyCalculator:', html.includes('daily-hourly-wage'));
  await browser.close();
})();
