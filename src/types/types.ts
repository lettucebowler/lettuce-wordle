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
