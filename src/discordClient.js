const { Client, Intents } = require('discord.js-selfbot-v13');
const { DISCORD_TOKEN } = require('./config');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.MESSAGE_CONTENT,
	],
});

client.login(DISCORD_TOKEN);

module.exports = client;
