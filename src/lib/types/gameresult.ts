export type GameResult = {
	gamenum: number;
	user: string;
	user_id: number;
	attempts?: number;
	answers: string;
};

export type LeaderboardResults = {
	user: string;
	sum: number;
	count: number;
	score: number;
};
