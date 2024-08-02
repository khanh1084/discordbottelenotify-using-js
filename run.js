const client = require('./src/discordClient');
const { readSheetData } = require('./src/googleSheets');
const { sendTelegramMessages, messageQueue } = require('./src/messageHandler');
const { formatMessage } = require('./src/messageFormatter');

let DISCORD_CHANNEL_IDS = [];
const botStartTime = Date.now();

client.once('ready', () => {
	console.log(`We have logged in as ${client.user.tag}`);
	readSheetData(client, DISCORD_CHANNEL_IDS);
	sendTelegramMessages();
});

client.on('messageCreate', async (message) => {
	if (message.createdTimestamp < botStartTime) {
		return;
	}
	const channelName = message.channel.name;
	const serverName = message.guild.name;
	const link = `https://discord.com/channels/${message.guild.id}/${message.channel.id}`;
	const formattedMessage = formatMessage(channelName, serverName, link, [
		{
			user: message.author.username,
			content: message.content,
			timestamp: message.createdTimestamp,
		},
	]);
	messageQueue.push(formattedMessage);
});
