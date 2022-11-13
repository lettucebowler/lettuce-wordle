import { getGameNum } from './share';

const encodeState = (state: { gameNum: number; guesses: string[] }): string => {
	const stateString = JSON.stringify(state);
	const encoded = btoa(stateString);
	return encoded;
};

export const getCookieFromGameState = (
	gameState: {
		guess: string;
		complete: boolean;
	}[]
) => {
	const gameNum = getGameNum();
	const saveState = {
		gameNum,
		guesses: gameState.map((guess) => guess.guess)
	};
	const cookie = encodeState(saveState);
	return cookie;
};

const decodeState = (stateBuffer: string) => {
	let state: {
		gameNum: number;
		guesses: string[];
	} = {
		gameNum: getGameNum(),
		guesses: []
	};
	if (!stateBuffer) {
		return state;
	}
	try {
		const stateString = atob(stateBuffer);
		const parsed = JSON.parse(stateString);
		const currentGameNum = getGameNum();
		const { gameNum, guesses } = parsed;
		if (!guesses || gameNum !== currentGameNum || guesses?.at(0)?.complete) {
			return state;
		}
		state = {
			gameNum,
			guesses: guesses.map((guess: string) => ({ guess, complete: guess.length === 5 }))
		};
	} catch (e) {
		console.log(e);
		return state;
	}
	return state;
};

export const getGameFromCookie = (wordLettuceState: string) => {
	const gameState = decodeState(wordLettuceState);
	return gameState;
};
