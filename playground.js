function getRectangleString(width, height) {
	var header = '┌' + '─'.repeat(width - 2) + '┐\n';
	var footer = '└' + '─'.repeat(width - 2) + '┘';
	var body = '';
    for (var i = 0; i < height - 2; i++) {
    	body += '|' + ' '.repeat(width - 2) + '|\n';
    }
    return header + body + footer;
}
console.log(getRectangleString(6, 4));