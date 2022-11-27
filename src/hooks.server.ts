import type { RequestEvent } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getProfile, stashProfile } from '$lib/client/redis';
import { getUser } from '$lib/client/oauth';
import { getGameFromCookie } from '$lib/util/state';
import { get, set } from '$lib/client/workers-kv';

const AuthenticateSession = async (event: RequestEvent) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (session && !event.locals.user) {
		let refresh = false;
		let user = await getProfile(session);
		// let user = await get(session);
		if (!user.login) {
			user = await getUser(session, event.fetch);
			refresh = true;
		}
		if (refresh) {
			stashProfile(session, user);
			// set(session, user);
		}
		if (!user.login) {
			event.cookies.delete(SESSION_COOKIE_NAME);
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		event.locals.user = user;
	}
};

const addGameStateToSession = (event: RequestEvent) => {
	const wordLettuceState = event.cookies.get('wordLettuce') || '';
	const gameState = getGameFromCookie(wordLettuceState);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	event.locals.gameState = gameState?.guesses;
};

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	await AuthenticateSession(event);
	addGameStateToSession(event);
	const response = await resolve(event);
	return response;
};
