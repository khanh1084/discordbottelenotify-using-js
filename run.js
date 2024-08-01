const { Client, GatewayIntentBits } = require('discord.js');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const dotenvPath = path.resolve(__dirname, '.env');
console.log(`Loading .env from: ${dotenvPath}`);
dotenv.config({ path: dotenvPath });

// Discord bot token
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
console.log(`DISCORD_TOKEN: ${DISCORD_TOKEN}`);
// Telegram bot token
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
// Telegram chat ID
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// List of Discord channel IDs to monitor
const discordChannelIds = process.env.DISCORD_CHANNEL_IDS;
const DISCORD_CHANNEL_IDS = discordChannelIds
	? discordChannelIds.split(',')
	: [];

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
const telegramBot = new Telegraf(TELEGRAM_TOKEN);

const messageQueue = [];
let messageBuffer = [];

async function sendTelegramMessages() {
	while (true) {
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
		if (messageQueue.length > 0) {
			const combinedMessage = messageQueue.join('\n');
			messageQueue.length = 0; // Clear the queue
			try {
				await telegramBot.telegram.sendMessage(
					TELEGRAM_CHAT_ID,
					combinedMessage
				);
			} catch (e) {
				console.error(`Error sending message: ${e}`);
			}
		}
	}
}

client.once('ready', () => {
	console.log(`We have logged in as ${client.user.tag}`);
	sendTelegramMessages();
});

client.on('messageCreate', async (message) => {
	if (DISCORD_CHANNEL_IDS.includes(message.channel.id)) {
		messageQueue.push(message.content);
	}
});

client.login(DISCORD_TOKEN);
