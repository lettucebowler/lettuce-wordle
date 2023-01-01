import { sequence } from '@sveltejs/kit/hooks';
import SvelteKitAuth from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import {
	DEFAULT_DB_PROVIDER,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
} from '$env/static/private';
import { getGameFromCookie } from '$lib/util/state';
import { upsertUser } from '$lib/util/gameresults';

import type { Handle } from '@sveltejs/kit';

const providerHandler: Handle = async ({ event, resolve }) => {
	const searchParams = new URL(event.request.url).searchParams;
	const dbProvider = searchParams.get('dbProvider') || DEFAULT_DB_PROVIDER;
	event.locals.dbProvider = dbProvider;
	const response = await resolve(event);
	return response;
};

const gameStateHandler: Handle = async ({ event, resolve }) => {
	const wordLettuceState = event.cookies.get('wordLettuce') || '';
	const gameState = getGameFromCookie(wordLettuceState);
	event.locals.gameState = gameState?.guesses;
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
			const { email, image } = session?.user || {};
			const sessionUser = {
				email,
				image,
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
				const { login, id } = profile as { login: string; id: number };
				token = {
					...token,
					login,
					id
				};
				await upsertUser(
					{
						github_id: id,
						username: login
					},
					'all'
				);
			}
			return token;
		}
	}
});

export const handle = sequence(authHandler, gameStateHandler, providerHandler);
