import type { RequestEvent } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getUser } from '$lib/client/oauth';
import { getGameFromCookie } from '$lib/util/state';
import { getProfile as getKV, stashProfile as setKV } from '$lib/client/apiWordlettuce';

const AuthenticateSession = async (event: RequestEvent) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (session && !event.locals.user) {
		let user = await getKV(session);
		if (!user?.login) {
			user = await getUser(session, event.fetch);
			setKV(session, user);
		}
		if (!user?.login) {
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
