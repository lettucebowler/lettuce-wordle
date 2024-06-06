import { getCookieFromGameState } from '$lib/util/encodeCookie';
import { applyKey, applyWord, checkWords } from '$lib/util/gameFunctions';
import { fail } from '@sveltejs/kit';
import { getDailyWord, getGameNum } from '$lib/util/words';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';
import {
	AllowedWordSchema,
	type CompleteGuessOutput,
	type GuessOutput
} from '$lib/types/gameresult';
import { successAnswer } from '$lib/constants/app-constants.js';
import * as v from 'valibot';

export const trailingSlash = 'never';

export async function load(event) {
	const gameState = event.locals.getGameState();
	const answers = checkWords(gameState, getDailyWord());

	event.cookies.set('wordLettuce', getCookieFromGameState(gameState), {
		httpOnly: false,
		path: '/',
		maxAge: 86400,
		secure: false
	});

	return {
		state: gameState as GuessOutput[],
		answers,
		success: answers.length && answers.at(-1) === successAnswer
	};
}

export const actions: import('./$types').Actions = {
	keyboard: async (event) => {
		const data = await event.request.formData();
		const key = data.get('key')?.toString();
		if (!key) {
			return {
				invalid: true,
				success: false
			};
		}
		const gameState = event.locals.getGameState();
		const guesses = gameState || [];

		const updatedGuesses = applyKey(key, guesses, checkWords(guesses, getDailyWord()));
		event.cookies.set('wordLettuce', getCookieFromGameState(updatedGuesses), {
			httpOnly: false,
			path: '/',
			maxAge: 86400
		});
		const form = {
			invalid: false,
			success: false
		};
		return form;
	},

	word: async (event) => {
		const data = await event.request.formData();
		const gameState = event.locals.getGameStateV2();
		const guess = data
			.getAll('guess')
			.map((letter) => letter.toString().toLowerCase())
			.join('');
		const checkedGuess = v.safeParse(AllowedWordSchema, guess);
		if (!checkedGuess.success) {
			return fail(400, {
				success: false,
				invalid: true
			});
		}
		const answer = getDailyWord();
		if (guess === answer) {
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
	},

	enter: async (event) => {
		const data = await event.request.formData();
		const gameState: CompleteGuessOutput[] = event.locals
			.getGameState()
			.filter((guess): guess is CompleteGuessOutput => guess.complete);
		const guess: GuessOutput = {
			guess: data
				.getAll('guess')
				.map((l) => l.toString().toLowerCase())
				.join(''),
			complete: false
		};

		const { metadata, updatedGuesses, updatedAnswers } = applyWord(
			gameState,
			guess,
			checkWords(gameState, getDailyWord())
		);
		if (metadata.invalid) {
			return fail(400, metadata);
		}
		const session = await event.locals.auth();

		if (session?.user && updatedAnswers?.at(-1) === 'xxxxx') {
			const { saveGame } = createApiWordlettuceClient(event);
			await saveGame({
				userId: session.user.githubId,
				gameNum: getGameNum(),
				answers: updatedAnswers.join('')
			});
		}
		event.cookies.set('wordLettuce', getCookieFromGameState(updatedGuesses), {
			httpOnly: false,
			path: '/',
			maxAge: 86400,
			secure: false
		});
		return metadata;
	}
};
