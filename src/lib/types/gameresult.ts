export type GameResult = {
	gamenum: number;
	user_id: number;
	attempts?: number;
	answers: string;
	username?: string;
};

export type LeaderboardResults = {
	user: string;
	sum: number;
	count: number;
	score: number;
};
