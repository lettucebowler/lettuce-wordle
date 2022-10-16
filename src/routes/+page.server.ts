import { encodeState, getGameFromCookie } from '$lib/util/state';
import { applyWord, applyKey } from '$lib/util/gameFunctions';
import { invalid } from '@sveltejs/kit';
import { saveGameResults } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';

export const load: import('./$types').PageServerLoad = ({ cookies, depends, locals }) => {
	depends('/');

	const wordLettuceState = cookies.get('wordLettuceState') || '';
	let gameState = getGameFromCookie(wordLettuceState);

	cookies.set('wordLettuceState', encodeState(gameState), {
		httpOnly: false,
		path: '/',
		maxAge: 86400,
		secure: false
	});

	return {
		state: gameState
	};
};

export const actions: import('./$types').Actions = {
	keyboard: async ({ url, cookies }) => {
		const key: string = url.searchParams.get('key') || '';
		const wordLettuceState = cookies.get('wordLettuceState') || '';
		const gameState = getGameFromCookie(wordLettuceState);
		const guesses = gameState?.guesses || [];
		const { answer } = gameState;

		const answers = gameState?.answers || [];
		const updatedGuesses = applyKey(key, guesses, answers);
		cookies.set('wordLettuceState', encodeState({ answer, guesses: updatedGuesses, answers }), {
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
		const wordLettuceState = event.cookies.get('wordLettuceState') || '';
		const data = await event.request.formData();

		const gameState = getGameFromCookie(wordLettuceState);
		const guess = data.getAll('guess').map((l) => l.toString().toLowerCase());

		const { metadata, updatedGame } = applyWord(gameState, guess);
		if (metadata.invalid) {
			return invalid(400, metadata);
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { user } = event.locals;
		if (user) {
			const gameNum = getGameNum();
			saveGameResults(user.login, gameNum, updatedGame.answers);
		}

		event.cookies.set('wordLettuceState', encodeState(updatedGame), {
			httpOnly: false,
			path: '/',
			maxAge: 86400,
			secure: false
		});
		return metadata;
	}
};
