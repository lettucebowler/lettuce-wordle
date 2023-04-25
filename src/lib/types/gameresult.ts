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

export const gameResultSchema = z.object({
	user: z.string().optional(),
	user_id: z.number().int().positive(),
	gamenum: z.number().int().positive(),
	answers: z.string(),
	attempts: z.number().int().positive().optional()
});
export type GameResult = z.infer<typeof gameResultSchema>;
