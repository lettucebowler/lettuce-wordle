import { getDailyWord } from './words';

export const encodeState = (state: { guesses: string[]; answers: string[] }): string => {
	const stateString = `${state?.guesses?.join(',') || ''}_${state?.answers?.join(',') || ''}`;
	const encoded = btoa(stateString);
	return encoded;
};

const decodeState = (stateBuffer: string) => {
	let state: {
		guesses: string[];
		answers: string[];
	} = {
		guesses: [],
		answers: []
	};
	if (!stateBuffer) {
		return state;
	}
	let stateString = '';
	try {
		stateString = atob(stateBuffer);
	} catch {}
	const [guesses, answers] = stateString.split('_');
	const words = guesses ? guesses.split(',') : [];
	const statuses = answers ? answers.split(',') : [];
	state = {
		guesses: words,
		answers: statuses
	};
	return state;
};

export const getGameFromCookie = (wordLettuceState: string) => {
	const gameState = decodeState(wordLettuceState);
	const dailyWord = getDailyWord();
	if (!gameState?.answers || !gameState?.guesses) {
		return {
			answer: dailyWord,
			guesses: [],
			answers: []
		};
	}
	return gameState;
};
