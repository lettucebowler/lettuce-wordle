import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('github_id').primaryKey(),
	username: text('username').notNull().unique()
});

export const gameResults = sqliteTable(
	'game_results',
	{
		gameNum: integer('gamenum').notNull(),
		answers: text('answers').notNull(),
		userId: integer('user_id').notNull(),
		attempts: integer('attempts').notNull()
	},
	(table) => {
		return {
			gameNumIdx: index('game_num_idx').on(table.gameNum)
		};
	}
);
