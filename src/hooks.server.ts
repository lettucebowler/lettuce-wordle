import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { skipCSRFCheck } from '@auth/core';
import {
	AUTH_SECRET,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
} from '$env/static/private';
import { getGameFromCookie } from '$lib/util/decodeCookie.server';
import { upsertUser, type Provider, providerEnum } from '$lib/util/gameresults';
import { error, type Handle, type RequestEvent } from '@sveltejs/kit';
import { userProfileSchema, wordLettuceSessionSchema } from '$lib/types/auth';
import { safeParse, union, void_, null_ } from 'valibot';

function isProvider(input: string): input is Provider {
	return providerEnum.includes(input as Provider);
}

const createProviderGetter = (event: RequestEvent) => (): Provider | undefined => {
	const searchParams = new URL(event.request.url).searchParams;
	const dbProviderOverride = searchParams.get('dbProvider');
	if (!dbProviderOverride) {
		return;
	}

	if (!isProvider(dbProviderOverride)) {
		return;
	}

	event.locals.dbProviderOverwritten = true;
	return dbProviderOverride;
};
const providerHandler: Handle = async ({ event, resolve }) => {
	event.locals.getDbProvider = createProviderGetter(event);
	event.locals.dbProviderOverwritten = false;

	const logString = `${event.request.method} ${event.url.pathname}${
		event.url.search ? `${event.url.search}` : ''
	}`;
	console.time(logString);
	const response = await resolve(event);
	console.timeEnd(logString);
	return response;
};

const createGameStateGetter = (event: RequestEvent) => () => {
	const wordLettuceState = event.cookies.get('wordLettuce') || '';
	const gameState = getGameFromCookie(wordLettuceState);
	return gameState.guesses;
};
const gameStateHandler: Handle = async ({ event, resolve }) => {
	event.locals.getGameState = createGameStateGetter(event);
	return resolve(event);
};

const createWordLettuceSessionGetter =
	(event: RequestEvent<Partial<Record<string, string>>, string | null>) => async () => {
		const parseResult = safeParse(
			union([wordLettuceSessionSchema, void_(), null_()]),
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

const authHandler: Handle = ({ event, resolve }) =>
	SvelteKitAuth({
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
						await upsertUser({ event, provider: 'all', data: profileParseResult.output });
					}
				}
				return token;
			}
		}
	})({ event, resolve });

export const handle = sequence(authHandler, sessionHandler, gameStateHandler, providerHandler);
