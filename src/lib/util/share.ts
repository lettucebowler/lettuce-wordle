import { getDailyWord } from './words';

export const getGameStatus = (appName: string, statuses: string[]) => {
	const gameStatus = statuses.filter((l) => l[0] !== 'none');
	const gameNum = getGameNum();

	const today = `${appName} ${gameNum} ${gameStatus.length}/6`;
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
	const msInADay = 1000 * 60 * 60 * 24;
	const initial = new Date(1643673600000);
	const now = new Date();
	const gameNum = Math.floor((now.getTime() - initial.getTime()) / msInADay);
	return gameNum;
};

export const getDateFromGameNum = (gameNum: number) => {
	const initialDate = new Date('2022-02-01T00:00:00Z');
	const gameDateTime = initialDate.getTime() + gameNum * 24 * 60 * 60 * 1000;
	const gameDate = new Date(gameDateTime);
	return gameDate;
};
