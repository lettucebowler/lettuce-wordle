import { getGameNum } from './words';
import type { GuessOutput } from '$lib/types/gameresult';

const encodeState = (state: { gameNum: number; guesses: GuessOutput[] }): string => {
	const stateString = JSON.stringify(state);
	const encoded = btoa(stateString);
	return encoded;
};

export const getCookieFromGameState = (gameState: GuessOutput[]) => {
	const gameNum = getGameNum();
	const saveState = {
		gameNum,
		guesses: gameState
	};
	const cookie = encodeState(saveState);
	return cookie;
};
