import { getCookieFromGameState } from '$lib/util/state';
import { applyWord, applyKey, checkWords } from '$lib/util/gameFunctions';
import { invalid } from '@sveltejs/kit';
import { saveGameResults } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';
import { getDailyWord } from '$lib/util/words';

export const load: import('./$types').PageServerLoad = ({ cookies, depends, locals }) => {
	depends('/');

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const gameState: { guess: string; complete: boolean }[] = locals.gameState;

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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const gameState = locals.gameState;
		const guesses = gameState || [];

		const updatedGuesses = applyKey(key, guesses);
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

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const gameState = event.locals.gameState;
		const guess = data.getAll('guess').map((l) => l.toString().toLowerCase());

		const { metadata, updatedGuesses, updatedAnswers } = applyWord(gameState, guess);
		if (metadata.invalid) {
			return invalid(400, metadata);
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { user } = event.locals;
		if (user) {
			const gameNum = getGameNum();
			saveGameResults(user.login, gameNum, updatedAnswers);
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
