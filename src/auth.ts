import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { skipCSRFCheck } from '@auth/core';
import {
	AUTH_SECRET,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
} from '$env/static/private';
import { object, safeParse, string, parse, number, integer, minValue, email } from 'valibot';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server';
import { getDailyWord, getGameNum } from '$lib/util/words';
import { checkWords, checkWordsV2 } from '$lib/util/gameFunctions';
import { successAnswer } from '$lib/constants/app-constants';

const tokenSchema = object({
	login: string(),
	id: number()
});

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
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
			session({ session, token }) {
				const tokenData = parse(tokenSchema, token);
				return {
					...session,
					user: {
						...session.user,
						login: tokenData.login,
						githubId: tokenData.id
					}
				};
			},
			async jwt({ token, profile }) {
				if (profile) {
					const profileParseResult = safeParse(
						object({
							id: number([integer(), minValue(0)]),
							login: string(),
							email: string([email()])
						}),
						profile
					);
					if (profileParseResult.success) {
						const { login, id } = profileParseResult.output;
						token = {
							...token,
							login,
							id
						};
						const { upsertUser, saveGame } = createApiWordlettuceClient(event);
						await upsertUser(profileParseResult.output);

						try {
							const gameState = event.locals.getGameStateV2();
							const answers = checkWordsV2({ guesses: gameState.guesses });
							if (answers.length && answers?.at(-1) === successAnswer) {
								await saveGame({
									userId: profileParseResult.output.id,
									gameNum: getGameNum(),
									answers: answers.join('')
								});
							}
						} catch (e) {}
					}
				}
				return token;
			}
		}
	};
	return authOptions;
});
