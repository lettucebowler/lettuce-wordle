import type { RequestEvent } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import SvelteKitAuth from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import {
	SESSION_COOKIE_NAME,
	DEFAULT_AUTH_PROVIDER,
	DEFAULT_DB_PROVIDER,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
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
			stashProfile(session, user, 'all');
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

const gameStateHandler: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
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

const authHandler = SvelteKitAuth({
	providers: [
		GitHub({
			clientId: SK_AUTH_GITHUB_CLIENT_ID,
			clientSecret: SK_AUTH_GITHUB_CLIENT_SECRET,
			authorization: {
				url: 'https://github.com/login/oauth/authorize',
				params: { scope: 'email' }
			}
		})
	],
	trustHost: true,
	callbacks: {
		async session({ session, token, user }) {
			const sessionUser = {
				...session?.user,
				login: token.login
			};

			const provider = token.provider;
			const providerAccountId = token.providerAccountId;
			return {
				...session,
				user: sessionUser,
				provider,
				providerAccountId
			};
		},
		async jwt({ token, account, profile }) {
			if (account) {
				token.provider = account.provider;
			}
			if (profile) {
				const { login, id } = profile as any;
				token = {
					...token,
					login,
					id
				};
			}
			return token;
		}
	}
});

export const handle = sequence(authHandler, gameStateHandler);
