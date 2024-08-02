function escapeHtml(unsafe) {
	return unsafe.replace(/[&<"']/g, function (m) {
		switch (m) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '"':
				return '&quot;';
			case "'":
				return '&#039;';
			default:
				return m;
		}
	});
}

function formatMessage(channelName, serverName, link, messages) {
	const header = `<b>${escapeHtml(channelName)}</b> - ${escapeHtml(
		serverName
	)} (<a href="${escapeHtml(link)}">link</a>)\n\n`;
	const formattedMessages = messages
		.map((msg) => {
			const content = escapeHtml(msg.content).replace(/<@(\d+)>/g, '@$1');
			const timestamp = new Date(msg.timestamp).toLocaleString();
			return `${escapeHtml(msg.user)} [${timestamp}]: ${content}`;
		})
		.join('\n');
	return header + formattedMessages;
}

module.exports = { formatMessage };
