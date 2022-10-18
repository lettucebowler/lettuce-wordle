export const encodeState = (state: { guess: string; complete: boolean }[]): string => {
	const stateString = JSON.stringify(state);
	const encoded = btoa(stateString);
	return encoded;
};

const decodeState = (stateBuffer: string) => {
	let state: {
		guess: string;
		complete: boolean;
	}[] = [];
	if (!stateBuffer) {
		return state;
	}
	try {
		const stateString = atob(stateBuffer);
		const parsed = JSON.parse(stateString);
		state = parsed;
	} catch {
		return state;
	}
	return state;
};

export const getGameFromCookie = (wordLettuceState: string) => {
	const gameState = decodeState(wordLettuceState);
	return gameState;
};
