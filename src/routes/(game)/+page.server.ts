import { getCookieFromGameState } from '$lib/util/state';
import { applyWord, applyKey, checkWords } from '$lib/util/gameFunctions';
import { fail as invalid, redirect } from '@sveltejs/kit';
import { getGameNum } from '$lib/util/share';
import { getDailyWord } from '$lib/util/words';
import { saveGameResults } from '$lib/util/gameresults';
import type { WordLettuceSession } from '$lib/types/auth';
import type { GameResult } from '$lib/types/gameresult';

export const load: import('./$types').PageServerLoad = async (event) => {
	event.depends('/');

	const gameState = event.locals.gameState;

	const answers = checkWords(gameState, getDailyWord());

	const session = (await event.locals.getSession()) as WordLettuceSession;

	const query = new URL(event.request.url).searchParams;

	const doSaveGame = query.get('saveGame') === 'true';

	if (doSaveGame) {
		if (!session?.user) {
			throw redirect(307, '/');
		}
		if (!gameState?.length) {
			throw redirect(307, '/');
		}
		if (!answers?.length || answers?.at(-1) !== 'xxxxx') {
			throw redirect(307, '/');
		}
		const login = session.user?.login;
		const id = session.user?.id;
		if (login && id) {
			const gameResult: GameResult = {
				username: login,
				user_id: id,
				gamenum: getGameNum(),
				answers: answers.join('')
			};
			console.log(
				'save game'
			);
			console.log(gameResult);
			await saveGameResults(gameResult, 'all');
			throw redirect(307, '/');
		}
	}

	event.cookies.set('wordLettuce', getCookieFromGameState(gameState), {
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
		const session = (await event.locals.getSession()) as WordLettuceSession;
		const user = session?.user;
		if (user && updatedAnswers?.at(-1) === 'xxxxx') {
			const gamenum = getGameNum();
			const gameResult: GameResult = {
				gamenum,
				username: user.login,
				user_id: user.id,
				answers: updatedAnswers?.join('') || ''
			};
			await saveGameResults(gameResult, 'all');
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
