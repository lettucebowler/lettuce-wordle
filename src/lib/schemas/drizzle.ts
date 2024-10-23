import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('github_id').primaryKey(),
	username: text('username').notNull()
});

export const gameResults = sqliteTable('game_results', {
	gameNum: integer('gamenum').notNull(),
	answers: text('answers').notNull(),
	userId: integer('user_id').notNull(),
	attempts: integer('attempts').notNull()
});
