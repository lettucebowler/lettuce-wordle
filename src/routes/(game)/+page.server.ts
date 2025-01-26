import { fail } from '@sveltejs/kit';
import { STATE_COOKIE_NAME_V2 } from '$lib/constants/app-constants.js';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';
import * as v from 'valibot';
import { GameKey } from '$lib/schemas/game.js';
import { WordlettuceGame } from '$lib/game/wordlettuce-game.svelte.js';

export const trailingSlash = 'never';

export async function load(event) {
	const game = event.locals.getGameStateV3();

	event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), {
		httpOnly: false,
		path: '/',
		maxAge: 86400,
		secure: false
	});

	return {
		game: {
			currentGuess: game.currentGuess,
			success: game.success,
			guesses: game.guesses,
			gameNum: game.gameNum
		}
	};
}

export const actions: import('./$types').Actions = {
	letter: async (event) => {
		const game = event.locals.getGameStateV3();
		const key = (await event.request.formData()).get('key');
		const parseResult = v.safeParse(GameKey, key);

		if (!parseResult.success) {
			return fail(400, {
				success: false,
				invalid: true
			});
		}

		if (parseResult.output === 'enter') {
			return {
				success: false,
				invalid: false
			};
		}

		if (parseResult.output === 'backspace') {
			game.doUndo();
		} else {
			const { error } = game.doLetter(parseResult.output);
			if (error) {
				return fail(400, {
					success: false,
					invalid: true
				});
			}
		}

		event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), {
			httpOnly: false,
			path: '/',
			maxAge: 86400,
			secure: false
		});

		return {
			success: false,
			invalid: false
		};
	},

	word: async (event) => {
		let game = event.locals.getGameStateV3();
		if (game.success) {
			return {
				success: true,
				invalid: false
			};
		}
		const data = await event.request.formData();
		const guess = data
			.getAll('guess')
			.map((letter) => letter.toString().toLowerCase())
			.join('')
			.slice(0, 5);
		game.currentGuess = guess;
		const { error } = game.doSumbit();
		if (error) {
			return fail(400, {
				success: false,
				invalid: true
			});
		}
		game = new WordlettuceGame({ gameNum: game.gameNum, guesses: game.guesses });
		event.cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), {
			httpOnly: false,
			path: '/',
			maxAge: 86400,
			secure: false
		});
		if (game.success) {
			const session = await event.locals.auth();
			if (session?.user) {
				const userId = session.user.githubId;
				const apiWordlettuce = createApiWordlettuceClient(event);
				const inserts = await apiWordlettuce.saveGame({
					answers: game.answers.join(''),
					userId,
					gameNum: game.gameNum
				});
				if (!inserts.length) {
					fail(500, { message: 'Error saving to database' });
				}
			}
			return {
				success: true,
				invalid: false
			};
		} else {
			return {
				success: false,
				invalid: false
			};
		}
	}
};
