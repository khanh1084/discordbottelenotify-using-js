const { Client, GatewayIntentBits } = require('discord.js');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Load environment variables from .env file
const dotenvPath = path.resolve(__dirname, '.env');
console.log(`Loading .env from: ${dotenvPath}`);
dotenv.config({ path: dotenvPath });

// Log environment variables
console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN);
console.log('TELEGRAM_TOKEN:', process.env.TELEGRAM_TOKEN);
console.log('TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID);
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
console.log(
	'GOOGLE_SERVICE_ACCOUNT_FILE:',
	process.env.GOOGLE_SERVICE_ACCOUNT_FILE
);

// Google Sheets API setup
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
	keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_FILE,
	scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Discord and Telegram setup
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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

// Global variable to store Discord channel IDs
let DISCORD_CHANNEL_IDS = [];

async function readSheetData() {
	const authClient = await auth.getClient();
	const request = {
		spreadsheetId: process.env.GOOGLE_SHEET_ID,
		range: 'Sheet1!A:A',
		auth: authClient,
	};

	const response = await sheets.spreadsheets.values.get(request);
	const rows = response.data.values;
	if (rows.length) {
		for (const row of rows) {
			const url = row[0];
			const serverMatch = url.match(/\/channels\/(\d+)\/?(\d+)?/);
			if (serverMatch) {
				const serverId = serverMatch[1];
				const channelId = serverMatch[2];

				try {
					const guild = await client.guilds.fetch(serverId);
					console.log(`Fetched guild: ${guild.name}`);
					if (channelId) {
						// Add specific channel ID
						DISCORD_CHANNEL_IDS.push(channelId);
					} else {
						// Fetch all channels for the server
						const channels = await guild.channels.fetch();
						channels.forEach((channel) => {
							if (channel.isTextBased()) {
								DISCORD_CHANNEL_IDS.push(channel.id);
							}
						});
					}
				} catch (error) {
					console.error(
						`Error fetching guild with ID ${serverId}:`,
						error
					);
				}
			}
		}
		DISCORD_CHANNEL_IDS = DISCORD_CHANNEL_IDS.filter((id) => id !== null);
		console.log('Loaded Discord Channel IDs:', DISCORD_CHANNEL_IDS);
	} else {
		console.log('No data found in the sheet.');
	}
}

// Function to format and send Telegram messages
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

// Function to format the message
function formatMessage(channelName, serverName, link, messages) {
	const header = `<b>${channelName}</b> - ${serverName} (<a href="${link}">link</a>)\n\n`;
	const formattedMessages = messages
		.map((msg) => `${msg.user}: ${msg.content}`)
		.join('\n');
	return header + formattedMessages;
}

client.once('ready', () => {
	console.log(`We have logged in as ${client.user.tag}`);
	readSheetData();
	sendTelegramMessages();
});

client.on('messageCreate', async (message) => {
	console.log('Received message in channel:', message.channel.id);
	if (DISCORD_CHANNEL_IDS.includes(message.channel.id)) {
		const channelName = message.channel.name;
		const serverName = message.guild.name;
		const link = `https://discord.com/channels/${message.guild.id}/${message.channel.id}`;
		const formattedMessage = formatMessage(channelName, serverName, link, [
			{ user: message.author.username, content: message.content },
		]);
		messageQueue.push(formattedMessage);
	}
});

client.login(DISCORD_TOKEN);
