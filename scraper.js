const puppeteer = require('puppeteer');
const storage = require('./storage');
const settings = require('./settings');

// EF weekly schedule scraper
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('CONSOLE: ', msg.text()));

  // Go straight away to the online booking page
  await page.goto('https://ec.ef.com/evc/gl?icid=School.GroupClass.2012&lng=en');
  
  await page.evaluate((settings) => {
    document.querySelector("#username").value = settings.EF_LOGIN;
    document.querySelector("#password").value = settings.EF_PASSWORD;
  }, settings);

  const navPromise = page.waitForNavigation();
  await page.click('.etc-login-btn');
  await navPromise;

  // Wait for appearance of the checkbox "I would like a video class"
  await page.waitForSelector('.evc-layout-videooption-text', { visible: true });

  const schedule = await page.evaluate(() => {
    const rawSchedule = document.querySelectorAll('.evc-all-class-list-wrap td em');
    return Array.from(rawSchedule).map(item => { return item.innerText; });
  });

  storage.saveCurrentWeek(schedule);
  await browser.close();
})();
