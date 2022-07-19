export const encodeState = (state: { answer: string; words: string[] }): string => {
	const stateString = `${state.answer},${state.words.join(',')}`;
	const encoded = btoa(stateString);
	return encoded;
};

export const decodeState = (stateBuffer: string) => {
	if (!stateBuffer) {
		return {};
	}
	let state = {};
	try {
		const stateString = atob(stateBuffer);
		const [answer, ...words] = stateString.split(',');
		state = {
			answer,
			words
		};
	} catch (error) {
		const stateJson = JSON.parse(stateBuffer);
		state = stateJson;
	}
	return state;
};
