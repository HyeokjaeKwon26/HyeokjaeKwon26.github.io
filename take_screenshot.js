const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });
  await page.goto('https://powyyy-creator.github.io/hyeokjaekwon/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: 'C:\\Users\\powyy\\.gemini\\antigravity\\brain\\fa2f75e6-d711-497b-a985-303cac77e058\\academic_site_preview.png',
    fullPage: true
  });
  console.log('Screenshot saved successfully!');
  await browser.close();
})();
