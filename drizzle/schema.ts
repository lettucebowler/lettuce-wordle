import {
	sqliteTable,
	AnySQLiteColumn,
	index,
	primaryKey,
	integer,
	foreignKey,
	text,
	uniqueIndex,
	numeric
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

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

export const session = sqliteTable('session', {
	id: text().primaryKey().notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at').notNull()
});

export const user = sqliteTable(
	'user',
	{
		id: integer().primaryKey().notNull(),
		githubId: integer('github_id').notNull(),
		email: text().notNull(),
		username: text().notNull()
	},
	(table) => {
		return {
			githubIdIdx: index('github_id_index').on(table.githubId),
			emailUnique: uniqueIndex('user_email_unique').on(table.email),
			githubIdUnique: uniqueIndex('user_github_id_unique').on(table.githubId)
		};
	}
);

export const users = sqliteTable(
	'users',
	{
		githubId: integer('github_id').primaryKey().notNull(),
		username: text()
	},
	(table) => {
		return {
			usernameUnique: uniqueIndex('username_unique').on(table.username)
		};
	}
);

export const d1Migrations = sqliteTable('d1_migrations', {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text(),
	appliedAt: numeric('applied_at')
		.default(sql`(CURRENT_TIMESTAMP)`)
		.notNull()
});

export const cfKv = sqliteTable('_cf_KV', {});
