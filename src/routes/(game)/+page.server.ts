import { getCookieFromGameState } from '$lib/util/encodeCookie';
import { applyKey, applyWord, checkWords } from '$lib/util/gameFunctions';
import { fail } from '@sveltejs/kit';
import { getDailyWord, getGameNum } from '$lib/util/words';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';
import type { CompleteGuess, Guess, IncompleteGuess } from '$lib/types/gameresult';
import { successAnswer } from '$lib/constants/app-constants.js';

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
		state: gameState as Guess[],
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

	enter: async (event) => {
		const data = await event.request.formData();
		const gameState: CompleteGuess[] = event.locals
			.getGameState()
			.filter((guess): guess is CompleteGuess => guess.complete);
		const guess: IncompleteGuess = {
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
			const result = await saveGame({
				userId: session.user.githubId,
				gameNum: getGameNum(),
				answers: updatedAnswers.join('')
			});
			console.log('result', result);
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
