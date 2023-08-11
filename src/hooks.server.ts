import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { skipCSRFCheck } from '@auth/core';
import {
	AUTH_SECRET,
	EDGE_CONFIG,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
} from '$env/static/private';
import { get } from '@vercel/edge-config';
import { getGameFromCookie } from '$lib/util/decodeCookie.server';
import { upsertUser } from '$lib/util/gameresults';

import type { Handle } from '@sveltejs/kit';
import { createClient } from '@vercel/edge-config';

const edgeConfig = createClient(EDGE_CONFIG);

const providerHandler: Handle = async ({ event, resolve }) => {
	const searchParams = new URL(event.request.url).searchParams;
	const dbProviderOverride = searchParams.get('dbProvider');
	let dbProvider;
	console.time('woop');
	if (dbProviderOverride) {
		dbProvider = dbProviderOverride;
	} else {
		console.time('get edge config');
		dbProvider = `${await edgeConfig.get('DEFAULT_DB_PROVIDER')}`;
		console.timeEnd('get edge config');
	}
	console.timeEnd('woop');
	event.locals.dbProvider = dbProvider;
	event.locals.dbProviderOverwritten = !!dbProviderOverride;
	const logString = `${event.request.method} ${event.url.pathname}${
		event.url.search ? `?${event.url.search}` : ''
	}`;
	console.time(logString);
	const response = await resolve(event);
	console.timeEnd(logString);
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
	skipCSRFCheck,
	secret: AUTH_SECRET,
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
