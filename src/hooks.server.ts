import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { handle as authHandler } from './auth';
import { getGameNum } from '$lib/util/words';
import { STATE_COOKIE_NAME_V2 } from '$lib/constants/app-constants';
import { WordlettuceGame } from '$lib/game/wordlettuce-game.svelte';

function decodeStateV2(state: string) {
	if (!state) {
		return {
			gameNum: getGameNum(),
			guesses: [],
			currentGuess: ''
		};
	}
	const decoded = atob(state);
	const [gameNum, guesses, currentGuess] = decoded.split(';');
	if (!gameNum || Number(gameNum) !== getGameNum()) {
		return {
			gameNum: getGameNum(),
			guesses: [],
			currentGuess: ''
		};
	}
	return {
		gameNum: gameNum ? Number(gameNum) : getGameNum(),
		guesses: guesses.length ? guesses.split(',') : [],
		currentGuess
	};
}

function decodeStateV3(state: string) {
	if (!state) {
		return new WordlettuceGame();
	}
	const decoded = atob(state);
	const [gameNum, guesses, currentGuess] = decoded.split(';');
	if (!gameNum || Number(gameNum) !== getGameNum()) {
		return new WordlettuceGame();
	}
	return new WordlettuceGame({
		gameNum: gameNum ? Number(gameNum) : getGameNum(),
		guesses: guesses.length ? guesses.split(',') : [],
		currentGuess
	});
}

function createGetGameState(event: RequestEvent) {
	return {
		getGameStateV2: () => {
			const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
			return decodeStateV2(stateString);
		},
		getGameStateV3: () => {
			const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
			return decodeStateV3(stateString);
		}
	};
}

const gameStateHandler: Handle = async ({ event, resolve }) => {
	const before = performance.now();
	const { getGameStateV2, getGameStateV3 } = createGetGameState(event);
	event.locals.getGameStateV2 = getGameStateV2;
	event.locals.getGameStateV3 = getGameStateV3;
	const result = await resolve(event);
	const after = performance.now();
	console.log(event.request.method, new URL(event.request.url).pathname, after - before);
	return result;
};

const fetchHandler: Handle = ({ event, resolve }) => {
	return resolve(event, { filterSerializedResponseHeaders: (name) => name === 'content-type' });
};

export const handle = sequence(gameStateHandler, authHandler, fetchHandler);
