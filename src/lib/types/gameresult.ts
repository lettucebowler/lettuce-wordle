export type GameResult = {
	gamenum: number;
	user_id: number;
	attempts?: number;
	answers: string;
	username?: string;
};

export type LeaderboardResults = {
	user: string;
	userId: number;
	sum: number;
	count: number;
	score: number;
};
