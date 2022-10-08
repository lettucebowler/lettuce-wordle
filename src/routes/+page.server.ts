import { getDailyWord } from '$lib/util/words';
import { encodeState, decodeState } from '$lib/util/state';
import { applyWord, applyKey } from '$lib/util/gameFunctions';
import { invalid } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = ({ cookies, depends }) => {
	depends('/');

	const cookie = cookies.get('wordLettuceState') || '';
	let gameState = decodeState(cookie);
	const dailyWord = getDailyWord();
	const isStateForToday = gameState?.answer === dailyWord;
	if (!isStateForToday) {
		gameState = {
			answer: dailyWord,
			guesses: [],
			answers: []
		};
	}

	cookies.set('wordLettuceState', encodeState(gameState), { httpOnly: false });

	return {
		state: gameState
	};
};

export const actions: import('./$types').Actions = {
	keyboard: async ({ url, cookies }) => {
		const key: string = url.searchParams.get('key') || '';
		const game = decodeState(cookies.get('wordLettuceState') || '') || {};
		const guesses = game?.guesses || [];
		const { answer } = game;

		const answers = game?.answers || [];
		const updatedGuesses = applyKey(key, guesses, answers);
		cookies.set('wordLettuceState', encodeState({ answer, guesses: updatedGuesses, answers }), {
			httpOnly: false
		});
		const form = {
			invalid: false,
			success: false,
			failure: false
		};
		return form;
	},

	enter: async ({ request, cookies }) => {
		const cookie = cookies.get('wordLettuceState') || '';
		const data = await request.formData();

		const game = decodeState(cookie);
		const guess = data.getAll('guess').map((l) => l.toString().toLowerCase());

		const { metadata, updatedGame } = applyWord(game, guess);
		if (metadata.invalid) {
			return invalid(400, metadata);
		}
		cookies.set('wordLettuceState', encodeState(updatedGame), { httpOnly: false });
		return metadata;
	}
};
