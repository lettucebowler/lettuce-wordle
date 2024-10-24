import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { handle as authHandler } from './auth';
import { getGameNum } from '$lib/util/words';
import { STATE_COOKIE_NAME_V2 } from '$lib/constants/app-constants';

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

function createNewGameStateHandler(event: RequestEvent) {
	return () => {
		const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
		return decodeStateV2(stateString);
	};
}

const gameStateHandler: Handle = async ({ event, resolve }) => {
	const before = performance.now();
	event.locals.getGameStateV2 = createNewGameStateHandler(event);
	const result = await resolve(event);
	const after = performance.now();
	console.log(event.request.method, new URL(event.request.url).pathname, after - before);
	return result;
};

const fetchHandler: Handle = ({ event, resolve }) => {
	return resolve(event, { filterSerializedResponseHeaders: (name) => name === 'content-type' });
};

export const handle = sequence(gameStateHandler, authHandler, fetchHandler);
