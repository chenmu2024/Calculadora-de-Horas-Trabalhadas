import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1000));
  const html = await page.content();
  console.log('HTML length:', html.length);
  console.log('Includes DailyCalculator:', html.includes('daily-hourly-wage'));
  await browser.close();
})();
