import { getDailyWord } from '$lib/util/words';
import { encodeState, decodeState } from '$lib/util/state';
import { applyWord } from '$lib/util/gameFunctions';
import { invalid } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = ({ locals, cookies }: any) => {
	const cookie = cookies.get('wordLettuceState');
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

	cookies.set('wordLettuceState', encodeState(gameState));

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
		const current_row = answers.length;
		if (key.toLowerCase() === 'backspace') {
			if (!guesses[current_row]?.length) {
				return;
			}
			guesses[current_row] = guesses[current_row].slice(0, guesses[current_row].length - 1);
		} else {
			if (guesses[current_row]?.length > 4) {
				return;
			}
			guesses[current_row] = `${guesses[current_row] ? guesses[current_row] : ''}${key}`;
		}
		cookies.set('wordLettuceState', encodeState({ answer, guesses, answers }));
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
		// @ts-ignore
		const guess = data.getAll('guess').map((l: string) => l.toLowerCase());

		const { metadata, updatedGame } = applyWord(game, guess);
		if (metadata.invalid) {
			return invalid(400, metadata);
		}
		cookies.set('wordLettuceState', encodeState(updatedGame));
		return metadata;
	}
};
