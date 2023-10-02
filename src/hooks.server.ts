import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { skipCSRFCheck } from '@auth/core';
import {
	AUTH_SECRET,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET,
	DEFAULT_DB_PROVIDER
} from '$env/static/private';
import { getGameFromCookie } from '$lib/util/decodeCookie.server';
import { upsertUser } from '$lib/util/gameresults';

import { error, type Handle, type RequestEvent } from '@sveltejs/kit';
import { userProfileSchema, wordLettuceSessionSchema } from '$lib/types/auth';
import { safeParse, union, voidType, nullType } from 'valibot';

const providerHandler: Handle = async ({ event, resolve }) => {
	const searchParams = new URL(event.request.url).searchParams;
	const dbProviderOverride = searchParams.get('dbProvider');
	const dbProvider = dbProviderOverride || DEFAULT_DB_PROVIDER;
	event.locals.dbProvider = dbProvider;
	event.locals.dbProviderOverwritten = !!dbProviderOverride;
	const logString = `${event.request.method} ${event.url.pathname}${
		event.url.search ? `${event.url.search}` : ''
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
	return resolve(event);
};

const createWordLettuceSessionGetter =
	(event: RequestEvent<Partial<Record<string, string>>, string | null>) => async () => {
		const parseResult = safeParse(
			union([wordLettuceSessionSchema, voidType(), nullType()]),
			await event.locals.getSession()
		);
		if (!parseResult.success) {
			throw error(401, 'Invalid session data');
		}
		return parseResult.output;
	};

const sessionHandler: Handle = async ({ event, resolve }) => {
	event.locals.getWordLettuceSession = createWordLettuceSessionGetter(event);
	return resolve(event);
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
			const { email } = session?.user || {};
			const sessionUser = {
				email,
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
				const profileParseResult = safeParse(userProfileSchema, profile);
				if (profileParseResult.success) {
					const { login, id } = profileParseResult.output;
					token = {
						...token,
						login,
						id
					};
					await upsertUser(profileParseResult.output, 'all');
				}
			}
			return token;
		}
	}
});

export const handle = sequence(authHandler, sessionHandler, gameStateHandler, providerHandler);
