import type { RequestEvent } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getUserFromSession } from '$lib/client/github';
import { getGameFromCookie } from '$lib/util/state';
import { getProfile as getKV, stashProfile as setKV } from '$lib/client/apiWordlettuce';
import { getProfile as getUpstash, stashProfile as setUpstash } from '$lib/client/upstash';

const AuthenticateSession = async (event: RequestEvent) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';
	const authProvider = event.locals.authProvider || 'cf';
	if (session && !event.locals.user) {
		let user = authProvider === 'cf' ? await getKV(session) : await getUpstash(session);
		if (!user?.login) {
			user = await getUserFromSession(session, event.fetch);
			if (authProvider === 'cf') {
				setKV(session, user);
			} else {
				setUpstash(session, user);
			}
		}
		if (!user?.login) {
			event.cookies.delete(SESSION_COOKIE_NAME);
		}
		event.locals.user = user;
	}
};

const addGameStateToSession = (event: RequestEvent) => {
	const wordLettuceState = event.cookies.get('wordLettuce') || '';
	const gameState = getGameFromCookie(wordLettuceState);
	event.locals.gameState = gameState?.guesses;
};

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	const searchParams = new URL(event.request.url).searchParams;
	const authMode = searchParams.get('authProvider') || 'cf';
	const dbMode = searchParams.get('dbProvider') || 'cf';
	event.locals.authProvider = authMode;
	event.locals.dbProvider = dbMode;

	await AuthenticateSession(event);
	addGameStateToSession(event);
	const response = await resolve(event);
	return response;
};
