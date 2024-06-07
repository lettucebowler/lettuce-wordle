import { encodeStateV2 } from '$lib/util/encodeCookie';
import { checkWordsV2, checkWord } from '$lib/util/gameFunctions';
import { fail } from '@sveltejs/kit';
import { STATE_COOKIE_NAME_V2, successAnswer } from '$lib/constants/app-constants.js';
import * as v from 'valibot';
import type { GameState } from '$lib/schemas/game';
import { guessKeySchema } from '$lib/schemas/game';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server';
import { isAllowedGuess } from '$lib/util/words.js';

export const trailingSlash = 'never';

export async function load(event) {
	const gameState2 = event.locals.getGameStateV2();
	const answers2 = checkWordsV2({ guesses: gameState2.guesses });

	event.cookies.set(STATE_COOKIE_NAME_V2, encodeStateV2(gameState2), {
		httpOnly: false,
		path: '/',
		maxAge: 86400,
		secure: false
	});

	return {
		state: gameState2.guesses.map((guess) => {
			return {
				guess,
				complete: true
			};
		}) as Array<{ guess: string; complete: boolean }>,
		currentGuess: gameState2.currentGuess,
		answers: answers2,
		success: answers2.length ? answers2.at(-1) === successAnswer : false,
		gameState: gameState2 as GameState
	};
}

export const actions: import('./$types').Actions = {
	letter: async (event) => {
		const gameState = event.locals.getGameStateV2();
		const lastGuessResult = checkWord({ guess: gameState.guesses.at(-1) ?? '' });
		if (lastGuessResult === successAnswer) {
			return {
				success: true,
				invalid: false
			};
		}
		const data = await event.request.formData();
		const key = v.safeParse(guessKeySchema, data.get('key')?.toString());
		if (!key.success) {
			return fail(400, {
				success: false,
				invalid: true
			});
		}
		let newGameState;
		if (key.output.toLowerCase() === 'backspace') {
			newGameState = {
				...gameState,
				currentGuess: gameState.currentGuess.slice(0, -1)
			};
		} else {
			newGameState = {
				...gameState,
				currentGuess: gameState.currentGuess + key.output.toLowerCase()
			};
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
		const answers = checkWordsV2({ guesses: gameState.guesses });
		if (answers.at(-1) === 'xxxxx') {
			console.log('woah');
			return {
				success: true,
				invalid: false
			};
		}
		const guess = data
			.getAll('guess')
			.map((letter) => letter.toString().toLowerCase())
			.join('');
		if (!isAllowedGuess({ guess })) {
			return fail(400, {
				success: false,
				invalid: true
			});
		}
		const newGameState = {
			gameNum: gameState.gameNum,
			currentGuess: '',
			guesses: gameState.guesses.concat([guess])
		};
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
				const { saveGame } = createApiWordlettuceClient(event);
				await saveGame({
					userId: session.user.githubId,
					gameNum: newGameState.gameNum,
					answers: checkWordsV2({ guesses: newGameState.guesses }).join('')
				});
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
