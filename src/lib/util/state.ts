import { getGameNum } from './share';

const encodeState = (state: {
	gameNum: number;
	guesses: { guess: string; complete: boolean }[];
}): string => {
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
		guesses: gameState
	};
	const cookie = encodeState(saveState);
	return cookie;
};

const decodeState = (stateBuffer: string) => {
	let state: {
		gameNum: number;
		guesses: {
			guess: string;
			complete: boolean;
		}[];
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
		if (!parsed.gameNum || parsed.gameNum !== getGameNum()) {
			return state;
		}
		state = parsed;
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
