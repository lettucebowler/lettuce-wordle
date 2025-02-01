import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { skipCSRFCheck } from '@auth/core';
import {
	AUTH_SECRET,
	SK_AUTH_GITHUB_CLIENT_ID,
	SK_AUTH_GITHUB_CLIENT_SECRET
} from '$env/static/private';
import * as v from 'valibot';
import { Email, PositiveInteger } from '$lib/schemas/util';
// import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server';
import { createWordLettuceDao } from '$lib/dao/wordlettuce.server';

const tokenSchema = v.object({
	login: v.string(),
	id: v.number()
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
				const tokenData = v.parse(tokenSchema, token);
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
					const profileParseResult = v.safeParse(
						v.object({
							id: PositiveInteger,
							login: v.string(),
							email: Email
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
						const wordLettuce = createWordLettuceDao(event);
						// const apiWordlettuce = createApiWordlettuceClient(event);
						// await apiWordlettuce.upsertUser({ login, id });
						await wordLettuce.upsertUser({ userId: id, username: login });
						try {
							const game = event.locals.getGameStateV3();
							if (game.success) {
								await wordLettuce.saveGame({
									userId: profileParseResult.output.id,
									gameNum: game.gameNum,
									answers: game.answers.join('')
								});
							}
						} catch (e) {
							console.error(e);
							// do nothing
						}
					}
				}
				return token;
			}
		}
	};
	return authOptions;
});
