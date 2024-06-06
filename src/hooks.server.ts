import { sequence } from '@sveltejs/kit/hooks';
import { decodeStateV2, getGameFromCookie } from '$lib/util/decodeCookie.server';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { handle as authHandler } from './auth';

function createGameStateGetter(event: RequestEvent) {
	return () => {
		const wordLettuceState = event.cookies.get('wordLettuce') || '';
		const { guesses } = getGameFromCookie(wordLettuceState);
		return guesses;
	};
}

function createNewGameStateHandler(event: RequestEvent) {
	return () => {
		const stateString = event.cookies.get('wordlettuce-state') || '';
		const { guesses, currentGuess } = decodeStateV2(stateString);
		return {
			guesses,
			currentGuess
		};
	};
}

const gameStateHandler: Handle = async ({ event, resolve }) => {
	event.locals.getGameState = createGameStateGetter(event);
	event.locals.getGameStateV2 = createNewGameStateHandler(event);
	return resolve(event);
};

const fetchHandler: Handle = ({ event, resolve }) => {
	return resolve(event, { filterSerializedResponseHeaders: (name) => name === 'content-type' });
};

export const handle = sequence(gameStateHandler, authHandler, fetchHandler);
