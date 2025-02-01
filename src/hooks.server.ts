import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { handle as authHandler } from './auth';
import { STATE_COOKIE_NAME_V2 } from '$lib/constants/app-constants';
import { WordlettuceGame } from '$lib/game/wordlettuce-game.svelte';
import { getGameNum } from '$lib/util/words';

async function createGetGameState(event: RequestEvent) {
	const stateString = event.cookies.get(STATE_COOKIE_NAME_V2) || '';
	const requestClone = event.request.clone();
	let currentGameNum = getGameNum();
	if (requestClone.method === 'GET') {
		const searchParams = new URL(requestClone.url).searchParams;
		if (searchParams.has('gameNum') && Number(searchParams.get('gameNum'))) {
			currentGameNum = Number(searchParams.get('gameNum'))
		}
	}
	if (requestClone.method === 'POST') {
		const formData = await requestClone.formData();
		if (Number(formData.get('gameNum'))) {
			currentGameNum = Number(formData.get('gameNum'));
		}
	}
	return {
		getGameStateV3: () => {
			return WordlettuceGame.fromStateString({ state: stateString, currentGameNum: currentGameNum });
		}
	};
}

const gameStateHandler: Handle = async ({ event, resolve }) => {
	const before = performance.now();
	const { getGameStateV3 } = await createGetGameState(event);
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
