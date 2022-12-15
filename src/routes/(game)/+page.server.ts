import { getCookieFromGameState } from '$lib/util/state';
import { applyWord, applyKey, checkWords } from '$lib/util/gameFunctions';
import { fail as invalid } from '@sveltejs/kit';
import { getGameNum } from '$lib/util/share';
import { getDailyWord } from '$lib/util/words';
import { saveGameResults } from '$lib/util/gameresults';

export const load: import('./$types').PageServerLoad = ({ cookies, depends, locals }) => {
	depends('/');

	const gameState = locals.gameState;

	const answers = checkWords(gameState, getDailyWord());

	cookies.set('wordLettuce', getCookieFromGameState(gameState), {
		httpOnly: false,
		path: '/',
		maxAge: 86400,
		secure: false
	});

	return {
		state: gameState,
		answers
	};
};

export const actions: import('./$types').Actions = {
	keyboard: async ({ url, cookies, locals }) => {
		const key: string = url.searchParams.get('key') || '';
		const gameState = locals.gameState;
		const guesses = gameState || [];

		const updatedGuesses = applyKey(key, guesses, checkWords(guesses, getDailyWord()));
		cookies.set('wordLettuce', getCookieFromGameState(updatedGuesses), {
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

		const gameState = event.locals.gameState;
		const guess = data.getAll('guess').map((l) => l.toString().toLowerCase());

		const { metadata, updatedGuesses, updatedAnswers } = applyWord(
			gameState,
			guess,
			checkWords(gameState, getDailyWord())
		);
		if (metadata.invalid) {
			return invalid(400, metadata);
		}

		const { user } = event.locals;
		if (user) {
			const gamenum = getGameNum();
			const gameResult = {
				gamenum,
				user: user.login,
				answers: updatedAnswers?.join('') || ''
			};
			saveGameResults(gameResult, event.locals.dbProvider);
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
