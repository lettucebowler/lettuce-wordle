import {
	sqliteTable,
	uniqueIndex,
	integer,
	int,
	text,
	index,
	primaryKey
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		githubId: int('github_id').primaryKey(),
		username: text()
	},
	(table) => {
		return {
			usernameUnique: uniqueIndex('username_unique').on(table.username)
		};
	}
);

export const gameResults = sqliteTable(
	'game_results',
	{
		gamenum: integer().notNull(),
		answers: text({ length: 30 }).notNull(),
		userId: integer('user_id').notNull(),
		attempts: integer().notNull()
	},
	(table) => {
		return {
			gamenumDesc: index('game_results_gamenum_desc').on(table.gamenum),
			pk0: primaryKey({
				columns: [table.gamenum, table.userId],
				name: 'game_results_gamenum_user_id_pk'
			})
		};
	}
);
