import type { RequestEvent } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getUser } from '$lib/client/oauth';
import { getGameFromCookie } from '$lib/util/state';
import { getProfile as getKV, stashProfile as setKV } from '$lib/client/apiWordlettuce';
import { getProfile as getUpstash, stashProfile as setUpstash } from '$lib/client/upstash';

const AuthenticateSession = async (event: RequestEvent) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';
	const authProvider = event.locals.authProvider || 'cf';
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (session && !event.locals.user) {
		let user = authProvider === 'cf' ? await getKV(session) : await getUpstash(session);
		if (!user?.login) {
			user = await getUser(session, event.fetch);
			if (authProvider === 'cf') {
				setKV(session, user);
			} else {
				setUpstash(session, user);
			}
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
	const searchParams = new URL(event.request.url).searchParams;
	const authMode = searchParams.get('authProvider') || 'cf';
	const dbMode = searchParams.get('dbProvider') || 'cf';
	console.log(authMode);
	console.log(dbMode);
	event.locals.authProvider = authMode;
	event.locals.dbProvider = dbMode;
	await AuthenticateSession(event);
	addGameStateToSession(event);
	const response = await resolve(event);
	return response;
};
