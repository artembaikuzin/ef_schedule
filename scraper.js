const puppeteer = require('puppeteer');
const storage = require('./storage');
const settings = require('./settings');

// EF weekly schedule scraper
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('CONSOLE: ', msg.text()));

  // Go straight away to the online booking page
  await page.goto('https://ec.ef.com/evc/gl?icid=School.GroupClass.2012&lng=en');

  const evalSettings = settings;
  
  await page.evaluate((settings) => {
    document.querySelector("#username").value = settings.EF_LOGIN;
    document.querySelector("#password").value = settings.EF_PASSWORD;
  }, settings);

  const navPromise = page.waitForNavigation();
  
  await page.click('.etc-login-btn');
  await navPromise;

  page.on('response', async response => {
    if (response.request().method() === 'POST' &&
      response.url().startsWith('https://ec.ef.com/services/api/proxy/queryproxy') &&
      response.request().postData().includes('Anncouncement_')) {
        
      const data = await response.json();

      console.log('TEXT', await response.text());
      console.log('DATA: ', data)

      // FIXME: possible errors because of the absolute indexing
      const schedule = data.slice(1, 8).reverse()
        .map((item) => { return item['translation'] });

      storage.saveCurrentWeek(schedule);
    }
  });

  // Wait for appearance of the checkbox "I would like a video class"
  await page.waitForSelector('.evc-layout-videooption-text');
  await browser.close();
})();
