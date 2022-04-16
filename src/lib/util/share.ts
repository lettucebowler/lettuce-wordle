import type { Word, Letter } from '$lib/types/types';
import { Status } from '$lib/types/types';

export const getGameStatus = (appName: string, game: Word[]) => {
	const gameStatus = game
		.filter((w: Word) => w.complete)
		.map((w: Word) => w.word.map((l: Letter) => getStatusEmoji(l.status)));
	const today = `${appName} ${new Date().toLocaleDateString()} ${gameStatus.length}/6`;
	const strings = gameStatus.map((w) => w.join(''));
	const share = [today, ...strings].join('\n');
	return share;
};

const getStatusEmoji = (status: Status) => {
	const green = '🟩';
	const yellow = '🟨';
	const black = '⬛';
	switch (status) {
		case Status.CORRECT:
			return green;
		case Status.CONTAINS:
			return yellow;
		default:
			return black;
	}
};
