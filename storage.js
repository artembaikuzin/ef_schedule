const fs = require('fs');
const moment = require('moment');

const STORAGE = 'schedule/';

function currentWeek() {
  return moment().startOf('isoWeek').format('YYYY-MM-DD');
}

function weekFile() {
  return STORAGE + currentWeek() + '.json';
}

function loadCurrentWeek() {
  return JSON.parse(fs.readFileSync(weekFile(), 'utf8'));
}

function currentWeekExists() {
  return fs.existsSync(weekFile());
}

exports.currentWeekExists = currentWeekExists;
exports.loadCurrentWeek = loadCurrentWeek;
