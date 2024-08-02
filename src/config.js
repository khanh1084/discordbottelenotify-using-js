const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const dotenvPath = path.resolve(__dirname, '../.env');
// console.log(`Loading .env from: ${dotenvPath}`);
dotenv.config({ path: dotenvPath });

// Log environment variables
// console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN);
// console.log('TELEGRAM_TOKEN:', process.env.TELEGRAM_TOKEN);
// console.log('TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID);
// console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
// console.log(
// 	'GOOGLE_SERVICE_ACCOUNT_FILE:',
// 	process.env.GOOGLE_SERVICE_ACCOUNT_FILE
// );

module.exports = {
	DISCORD_TOKEN: process.env.DISCORD_TOKEN,
	TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
	TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
	GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
	GOOGLE_SERVICE_ACCOUNT_FILE: process.env.GOOGLE_SERVICE_ACCOUNT_FILE,
};
