import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { skipCSRFCheck } from '@auth/core';
import {
	AUTH_SECRET,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
} from '$env/static/private';
import { getGameFromCookie } from '$lib/util/decodeCookie.server';
import { error, type Handle, type RequestEvent } from '@sveltejs/kit';
import { userProfileSchema, wordLettuceSessionSchema } from '$lib/types/auth';
import { safeParse, union, void_, null_ } from 'valibot';
import type { Session } from '@auth/core/types';
import type { JWT } from '@auth/core/jwt';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server';

function createGameStateGetter(event: RequestEvent) {
	return () => {
		if (event.locals._gameState) {
			return event.locals._gameState;
		} else {
			const wordLettuceState = event.cookies.get('wordLettuce') || '';
			const { guesses } = getGameFromCookie(wordLettuceState);
			event.locals._gameState = guesses;
			return guesses;
		}
	};
}
const gameStateHandler: Handle = async ({ event, resolve }) => {
	event.locals.getGameState = createGameStateGetter(event);
	return resolve(event);
};

const createWordLettuceSessionGetter =
	(event: RequestEvent<Partial<Record<string, string>>, string | null>) => async () => {
		const parseResult = safeParse(
			union([wordLettuceSessionSchema, void_(), null_()]),
			await event.locals.auth()
		);
		if (!parseResult.success) {
			error(401, 'Invalid session data');
		}
		return parseResult.output;
	};

const sessionHandler: Handle = async ({ event, resolve }) => {
	event.locals.getWordLettuceSession = createWordLettuceSessionGetter(event);
	return resolve(event);
};

type ExtendedSession = Session & {
	user: {
		id: number;
		login: string;
	};
};

function isJWTSession(params: any): params is { session: Session; token: JWT } {
	return !!params?.token;
}

const authHandler = SvelteKitAuth(async (event) => {
	const authOptions: SvelteKitAuthConfig = {
		providers: [
			GitHub({
				clientId: SK_AUTH_GITHUB_CLIENT_ID,
				clientSecret: SK_AUTH_GITHUB_CLIENT_SECRET
			})
		],
		secret: AUTH_SECRET,
		trustHost: true,
		skipCSRFCheck,
		callbacks: {
			async session(params) {
				if (!isJWTSession(params)) {
					return params.session;
				}
				const { session, token } = params;
				if (!session || !session.user) {
					return session;
				}
				const sessionUser = {
					...session.user,
					id: token.id,
					login: token.login
				};
				return {
					...session,
					user: sessionUser
				} as ExtendedSession;
			},
			async jwt({ token, profile }) {
				if (profile) {
					const profileParseResult = safeParse(userProfileSchema, profile);
					if (profileParseResult.success) {
						const { login, id } = profileParseResult.output;
						token = {
							...token,
							login,
							id
						};
						const { upsertUser } = createApiWordlettuceClient(event);
						await upsertUser(profileParseResult.output);
					}
				}
				return token;
			}
		}
	};
	return authOptions;
});

const fetchHandler: Handle = ({ event, resolve }) => {
	return resolve(event, { filterSerializedResponseHeaders: (name) => name === 'content-type' });
};

export const handle = sequence(authHandler, sessionHandler, gameStateHandler, fetchHandler);
