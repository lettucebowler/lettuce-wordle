import type { RequestEvent } from '@sveltejs/kit';
import {
	SESSION_COOKIE_NAME,
	DEFAULT_AUTH_PROVIDER,
	DEFAULT_DB_PROVIDER
} from '$env/static/private';
import { getUserFromSession } from '$lib/client/github';
import { getGameFromCookie } from '$lib/util/state';
import { getProfile, stashProfile } from '$lib/util/auth';
const AuthenticateSession = async (event: RequestEvent) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';
	if (session && !event.locals.user) {
		let user = await getProfile(session, event.locals.authProvider);
		if (!user?.login) {
			user = await getUserFromSession(session, event.fetch);
			stashProfile(session, user, event.locals.authProvider);
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
	const authProvider = searchParams.get('authProvider') || DEFAULT_AUTH_PROVIDER;
	const dbProvider = searchParams.get('dbProvider') || DEFAULT_DB_PROVIDER;
	event.locals.authProvider = authProvider;
	event.locals.dbProvider = dbProvider;

	await AuthenticateSession(event);
	addGameStateToSession(event);
	const response = await resolve(event);
	return response;
};
