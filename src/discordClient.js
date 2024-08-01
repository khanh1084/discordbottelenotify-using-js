const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_TOKEN } = require('./config');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.login(DISCORD_TOKEN);

module.exports = client;
