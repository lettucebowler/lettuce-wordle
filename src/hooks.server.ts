import { sequence } from '@sveltejs/kit/hooks';
import { getGameFromCookie } from '$lib/util/decodeCookie.server';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { handle as authHandler } from './auth';

function createGameStateGetter(event: RequestEvent) {
	return () => {
		if (event.locals._gameState) {
			return event.locals._gameState;
		} else {
			const wordLettuceState = event.cookies.get('wordLettuce') || '';
			const { guesses } = getGameFromCookie(wordLettuceState);
			event.locals._gameState = guesses;
			return guesses;
		}
	};
}
const gameStateHandler: Handle = async ({ event, resolve }) => {
	event.locals.getGameState = createGameStateGetter(event);
	return resolve(event);
};

const fetchHandler: Handle = ({ event, resolve }) => {
	return resolve(event, { filterSerializedResponseHeaders: (name) => name === 'content-type' });
};

export const handle = sequence(gameStateHandler, authHandler, fetchHandler);
