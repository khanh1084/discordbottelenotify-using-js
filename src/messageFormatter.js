function formatMessage(channelName, serverName, link, messages) {
	const header = `<b>${channelName}</b> - ${serverName} (<a href="${link}">link</a>)\n\n`;
	const formattedMessages = messages
		.map((msg) => `${msg.user}: ${msg.content}`)
		.join('\n');
	return header + formattedMessages;
}

module.exports = { formatMessage };
