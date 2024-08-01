const { google } = require('googleapis');
const { GOOGLE_SERVICE_ACCOUNT_FILE, GOOGLE_SHEET_ID } = require('./config');

const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
	keyFile: GOOGLE_SERVICE_ACCOUNT_FILE,
	scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function readSheetData(client, DISCORD_CHANNEL_IDS) {
	const authClient = await auth.getClient();
	const request = {
		spreadsheetId: GOOGLE_SHEET_ID,
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

module.exports = { readSheetData };
