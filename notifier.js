const moment = require('moment');
const request = require('request');
const storage = require('./storage');
const settings = require('./settings');

if (!storage.currentWeekExists()) {
  console.log('There is no schedule for this week');
  return 1;
}

weekSchedule = storage.loadCurrentWeek();
today = weekSchedule[moment().isoWeekday() - 1];

if (today === undefined) {
  console.log('There is no schedule for today');
  return 2;
}

console.log(`Send "${today}" to chat ${settings.TELEGRAM_CHAT_ID}`);

request.post(
  `https://api.telegram.org/bot${settings.TELEGRAM_BOT_TOKEN}/sendMessage`)
  .form({ chat_id: settings.TELEGRAM_CHAT_ID, text: today });
