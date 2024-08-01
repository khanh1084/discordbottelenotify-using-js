const { TELEGRAM_CHAT_ID } = require('./config');
const telegramBot = require('./telegramBot');

const messageQueue = [];
let messageBuffer = [];

async function sendTelegramMessages() {
	while (true) {
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
		if (messageQueue.length > 0) {
			const combinedMessage = messageQueue.join('\n\n');
			messageQueue.length = 0; // Clear the queue
			try {
				await telegramBot.telegram.sendMessage(
					TELEGRAM_CHAT_ID,
					combinedMessage,
					{ parse_mode: 'HTML' } // Enable HTML parsing
				);
			} catch (e) {
				console.error(`Error sending message: ${e}`);
			}
		}
	}
}

module.exports = { sendTelegramMessages, messageQueue, messageBuffer };
