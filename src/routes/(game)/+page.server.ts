import { getCookieFromGameState } from '$lib/util/encodeCookie';
import { applyKey, applyWord, checkWords } from '$lib/util/gameFunctions';
import { fail, redirect } from '@sveltejs/kit';
import { getGameNum } from '$lib/util/share';
import { getDailyWord } from '$lib/util/words';
import { saveGameResults } from '$lib/util/gameresults';
import type { CompleteGuess, GameResult, Guess, IncompleteGuess } from '$lib/types/gameresult';
import { successAnswer } from '$lib/constants/app-constants.js';

export async function load(event) {
	const gameState = event.locals.getGameState();
	const answers = checkWords(gameState, getDailyWord());
	const session = await event.locals.getWordLettuceSession();
	const query = new URL(event.request.url).searchParams;
	const doSaveGame = query.get('saveGame') === 'true';

	if (doSaveGame) {
		if (!session) {
			throw redirect(307, '/');
		}
		if (!gameState?.length) {
			throw redirect(307, '/');
		}
		if (!answers?.length || answers?.at(-1) !== 'xxxxx') {
			throw redirect(307, '/');
		}
		const gameResult: GameResult = {
			gameNum: getGameNum(),
			answers: answers.join('')
		};
		await saveGameResults({ gameResult, userId: session.user.id, provider: 'all' });
		throw redirect(307, '/');
	}

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
				success: false,
				failure: false
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
			success: false,
			failure: false
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
		const session = await event.locals.getWordLettuceSession();

		if (session && updatedAnswers?.at(-1) === 'xxxxx') {
			const gameNum = getGameNum();
			const gameResult: GameResult = {
				gameNum,
				answers: updatedAnswers?.join('') || ''
			};
			await saveGameResults({
				gameResult,
				userId: session.user.id,
				provider: 'all'
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
