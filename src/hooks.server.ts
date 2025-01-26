import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { handle as authHandler } from './auth';
import { STATE_COOKIE_NAME_V2 } from '$lib/constants/app-constants';
import { WordlettuceGame } from '$lib/game/wordlettuce-game.svelte';

function createGetGameState(event: RequestEvent) {
	return {
		getGameStateV3: () => {
			const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
			return WordlettuceGame.fromStateString(stateString);
		}
	};
}

const gameStateHandler: Handle = async ({ event, resolve }) => {
	const before = performance.now();
	const { getGameStateV3 } = createGetGameState(event);
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
