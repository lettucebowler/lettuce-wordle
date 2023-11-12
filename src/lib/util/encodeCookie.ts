import { getGameNum } from './words';
import type { Guess } from '$lib/types/gameresult';

const encodeState = (state: { gameNum: number; guesses: Guess[] }): string => {
	const stateString = JSON.stringify(state);
	const encoded = btoa(stateString);
	return encoded;
};

export const getCookieFromGameState = (gameState: Guess[]) => {
	const gameNum = getGameNum();
	const saveState = {
		gameNum,
		guesses: gameState
	};
	const cookie = encodeState(saveState);
	return cookie;
};
