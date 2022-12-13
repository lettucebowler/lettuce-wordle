export type GameResult = {
	gamenum: number;
	user: string;
	attempts?: number;
	answers: string;
};

export type LeaderboardResults = {
	user: string;
	sum: number;
	count: number;
	score: number;
};
