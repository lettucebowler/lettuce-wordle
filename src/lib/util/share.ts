export const getGameStatus = (appName: string, statuses: string[]) => {
	const gameStatus = statuses.filter((l) => l[0] !== 'none');
	const gameNum = getGameNum();

	const today = `https://word.lettucebowler.net\n${appName} ${gameNum} ${gameStatus.length}/6`;
	const strings = gameStatus.map((k) =>
		k
			.split('')
			.map((w) => getStatusEmoji(w))
			.join('')
	);
	const share = [today, ...strings].join('\n');
	return share;
};

const getStatusEmoji = (status: string) => {
	const green = '🟩';
	const yellow = '🟨';
	const black = '⬛';
	switch (status) {
		case 'x':
			return green;
		case 'c':
			return yellow;
		default:
			return black;
	}
};

export const getGameNum = () => {
	const initialDate = new Date('2022-02-01T00:00:00Z');
	const todayDate = new Date();
	todayDate.setUTCHours(0, 0, 0, 0);
	const gameNum = (todayDate.getTime() - initialDate.getTime()) / 1000 / 60 / 60 / 24;
	return gameNum;
};
