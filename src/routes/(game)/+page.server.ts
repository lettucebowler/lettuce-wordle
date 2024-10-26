import { encodeStateV2 } from '$lib/util/encodeCookie';
import { checkWordsV2, checkWord, applyKey, applyWord } from '$lib/util/gameFunctions';
import { fail } from '@sveltejs/kit';
import { STATE_COOKIE_NAME_V2, successAnswer } from '$lib/constants/app-constants.js';
import type { GameState } from '$lib/schemas/game';
// import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';

export const trailingSlash = 'never';

export async function load(event) {
	const gameState = event.locals.getGameStateV2();
	const answers = checkWordsV2({ guesses: gameState.guesses });

	event.cookies.set(STATE_COOKIE_NAME_V2, encodeStateV2(gameState), {
		httpOnly: false,
		path: '/',
		maxAge: 86400,
		secure: false
	});

	return {
		currentGuess: gameState.currentGuess,
		answers,
		success: answers.length ? answers.at(-1) === successAnswer : false,
		gameState: gameState as GameState
	};
}

export const actions: import('./$types').Actions = {
	letter: async (event) => {
		const gameState = event.locals.getGameStateV2();
		const data = await event.request.formData();
		const key = data.get('key')?.toString() ?? '';
		const { error, gameState: newGameState } = applyKey({ gameState, key });
		if (error) {
			return fail(400, {
				success: false,
				invalid: true
			});
		}
		event.cookies.set(STATE_COOKIE_NAME_V2, encodeStateV2(newGameState), {
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
		const data = await event.request.formData();
		const gameState = event.locals.getGameStateV2();
		const guess = data
			.getAll('guess')
			.map((letter) => letter.toString().toLowerCase())
			.join('');
		const lastGuess = gameState.guesses.at(-1) ?? '';
		const lastGuessStatus = checkWord({ guess: lastGuess });
		if (lastGuessStatus === successAnswer) {
			return {
				success: true,
				invalid: false
			};
		}
		if (!guess) {
			return {
				success: false,
				invalid: false
			};
		}
		const { error, gameState: newGameState } = applyWord({ gameState, guess });
		if (error) {
			return fail(400, {
				success: false,
				invalid: true
			});
		}
		event.cookies.set(STATE_COOKIE_NAME_V2, encodeStateV2(newGameState), {
			httpOnly: false,
			path: '/',
			maxAge: 86400,
			secure: false
		});
		const guessStatus = checkWord({ guess });
		if (guessStatus === successAnswer) {
			const session = await event.locals.auth();
			if (session?.user) {
				const answers = checkWordsV2({ guesses: newGameState.guesses }).join('');
				const userId = session.user.githubId;
				const gameNum = newGameState.gameNum;
				// const { saveGame } = createWordlettuceBetaDao();
				const apiWordlettuce = createApiWordlettuceClient(event);
				// const inserts = await saveGame({ answers, userId, gameNum });
				const inserts = await apiWordlettuce.saveGame({ answers, userId, gameNum });
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
