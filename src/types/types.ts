export type Cell = {
	initial: boolean;
	legal: boolean;
	success: boolean;
	peerCell: boolean;
	peerDigit: boolean;
	number: string;
	row: number;
	col: number;
	selected: boolean;
};

export type CellSelectionEvent = {
	detail: {
		row: number;
		col: number;
	};
};

export enum Status {
	NONE = "none",
	CONTAINS = "contains",
	CORRECT = "correct",
	INCORRECT = "incorrect"
};

export type Letter = {
	letter: string;
	status: Status;
};

export type Word = {
	complete: boolean;
	word: Letter[];
};
