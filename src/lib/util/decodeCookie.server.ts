import { getGameNum } from './share';
import type { Guess } from '$lib/types/gameresult';
import { GameStateSchema } from '$lib/types/gameresult';
const decodeState = (stateBuffer: string) => {
	let state: {
		gameNum: number;
		guesses: Guess[];
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
		const result = GameStateSchema.safeParse(parsed);
		if (!result.success) {
			return state;
		}
		return result.data;
	} catch (e) {
		console.log('error decoding state', e);
		return state;
	}
};

export const getGameFromCookie = (wordLettuceState: string) => decodeState(wordLettuceState);
