const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://ericholtgrefe.com/');
  await page.screenshot({path: 'ech.png'});

  await browser.close();
})();