const { Client } = require('discord.js-selfbot-v13');
const { DISCORD_TOKEN } = require('./config');

const client = new Client();

client.login(DISCORD_TOKEN);

module.exports = client;
