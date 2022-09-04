export const getGameStatus = (appName: string, statuses: string[][]) => {
	const gameStatus = statuses.filter((l) => l[0] !== 'none');
	const today = `https://word.lettucebowler.net\n${appName} ${new Date().toUTCString()} ${
		gameStatus.length
	}/6`;
	const strings = gameStatus.map((k) => k.map((w) => getStatusEmoji(w)).join(''));
	const share = [today, ...strings].join('\n');
	return share;
};

const getStatusEmoji = (status: string) => {
	const green = '🟩';
	const yellow = '🟨';
	const black = '⬛';
	switch (status) {
		case 'correct':
			return green;
		case 'contains':
			return yellow;
		default:
			return black;
	}
};
