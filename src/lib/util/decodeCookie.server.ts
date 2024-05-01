import { getGameNum } from './words';
import type { GuessOutput } from '$lib/types/gameresult';
import { GameStateSchema } from '$lib/types/gameresult';
import { safeParse } from 'valibot';
const decodeState = (stateBuffer: string) => {
	const state: {
		gameNum: number;
		guesses: GuessOutput[];
	} = {
		gameNum: getGameNum(),
		guesses: []
	};
	if (!stateBuffer) {
		return state;
	}
	try {
		const stateString = atob(stateBuffer);
		const parsed = JSON.parse(stateString);
		const currentGameNum = getGameNum();
		if (parsed?.gameNum !== currentGameNum) {
			return state;
		}
		const result = safeParse(GameStateSchema, parsed);
		if (!result.success) {
			return state;
		}

		return result.output;
	} catch (e) {
		console.log('error decoding state', e);
		return state;
	}
};

export function getGameFromCookie(wordLettuceState: string) {
	return decodeState(wordLettuceState);
}
