const { Telegraf } = require('telegraf');
const { TELEGRAM_TOKEN } = require('./config');

const telegramBot = new Telegraf(TELEGRAM_TOKEN);

module.exports = telegramBot;
