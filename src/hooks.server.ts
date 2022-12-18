import type { RequestEvent } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import SvelteKitAuth from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import {
	DEFAULT_AUTH_PROVIDER,
	DEFAULT_DB_PROVIDER,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
} from '$env/static/private';
import { getGameFromCookie } from '$lib/util/state';
import { updateUsername } from '$lib/client/planetscale';

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

	addGameStateToSession(event);
	const response = await resolve(event);
	return response;
};

const authHandler = SvelteKitAuth({
	providers: [
		GitHub({
			clientId: SK_AUTH_GITHUB_CLIENT_ID,
			clientSecret: SK_AUTH_GITHUB_CLIENT_SECRET
		})
	],
	trustHost: true,
	callbacks: {
		async session({ session, token }) {
			const { name, ...restUser } = session?.user || {};
			const sessionUser = {
				...restUser,
				id: token.id,
				login: token.login
			};

			const provider = token.provider;
			return {
				...session,
				user: sessionUser,
				provider
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
				const results = await updateUsername(id, login);
				console.log(results);
			}
			return token;
		}
	}
});

export const handle = sequence(authHandler, gameStateHandler);
