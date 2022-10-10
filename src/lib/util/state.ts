export const encodeState = (state: {
	answer: string;
	guesses: string[];
	answers: string[];
}): string => {
	const stateString = `${state.answer || ''}_${state?.guesses?.join(',') || ''}_${
		state?.answers?.join(',') || ''
	}`;
	const encoded = stateString;
	return encoded;
};

export const decodeState = (stateBuffer: string) => {
	let state: {
		answer: string;
		guesses: string[];
		answers: string[];
	} = {
		answer: '',
		guesses: [],
		answers: []
	};
	if (!stateBuffer) {
		return state;
	}
	let stateString;
	try {
		stateString = atob(stateBuffer);
	} catch {
		stateString = stateBuffer;
	}
	const [answer, guesses, answers] = stateString.split('_');
	const words = guesses ? guesses.split(',') : [];
	const statuses = answers ? answers.split(',') : [];
	state = {
		answer,
		guesses: words,
		answers: statuses
	};
	return state;
};
