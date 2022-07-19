export const encodeState = (state: { answer: string; words: string[] }): string => {
	const stateString = `${state.answer},${state.words.join(',')}`;
	const encoded = btoa(stateString);
	return encoded;
};

export const decodeState = (stateBuffer: string) => {
	if (!stateBuffer) {
		return {};
	}
	const stateString = atob(stateBuffer);
	const [answer, ...words] = stateString.split(',');
	const state = {
		answer,
		words
	};
	return state;
};
