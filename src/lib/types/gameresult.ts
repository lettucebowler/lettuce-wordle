export type GameResult = {
	gamenum: number;
	user_id: number;
	attempts?: number;
	answers: string;
	username?: string;
};

import { z } from 'zod';
export const GuessSchema = z.object({
	guess: z
		.string()
		.max(5)
		.toLowerCase()
		.regex(/^[a-z]+$/, 'guess must be only letters'),
	complete: z.boolean()
});
export type Guess = z.infer<typeof GuessSchema>;

export const GameStateSchema = z.object({
	gameNum: z.number().int().positive(),
	guesses: GuessSchema.array()
});

export type GameState = z.infer<typeof GameStateSchema>;

export type LeaderboardResults = {
	user: string;
	userId: number;
	sum: number;
	count: number;
	score: number;
};
