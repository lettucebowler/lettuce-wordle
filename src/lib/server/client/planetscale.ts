import { Client } from '@planetscale/database';
import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME } from '$env/static/private';
import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';
import type { UserRecord } from '$lib/types/auth';

const config = {
	host: DATABASE_HOST,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
};

const client = new Client(config);

export const saveGameResults = async (gameResult: GameResult) => {
	const conn = client.connection();
	const attempts = Math.floor(gameResult.answers.length / 5);
	const answerString =
		gameResult.answers.length > 30 ? gameResult.answers.slice(-30) : gameResult.answers;
	const results = await conn.execute(
		'insert into game_results (gamenum, answers, attempts, user_id) values (?, ?, ?, ?) on duplicate key update answers = ?, attempts = ?',
		[gameResult.gamenum, answerString, attempts, gameResult.user_id, answerString, attempts]
	);
	return results;
};

export const getLeaderBoardResults = async (gameNum: number) => {
	const conn = client.connection();
	const results = await conn.execute(
		'select username, github_id, sum(attempts) guesses, count(attempts) games, count(attempts) + sum(case when attempts >= 6 then 0 else 6 - attempts end) score from game_results a inner join users b on a.user_id = b.github_id where gamenum > ? and gamenum <= ? group by user_id order by score desc, username limit 10',
		[gameNum - 7, gameNum]
	);
	const { rows } = results;

	const scores = rows.map((row) => {
		const [user, userId, sum, count, score] = Object.values(row);
		return {
			user,
			userId,
			sum: parseInt(sum),
			count: parseInt(count),
			score: parseInt(score)
		};
	});

	return scores as LeaderboardResults[];
};

export const getGameResults = async (user: string, count: number, offset = 0) => {
	const conn = client.connection();
	const [results, countResults] = await Promise.all([
		conn.execute(
			'select username user, user_id, gamenum, answers, attempts from game_results a inner join users b on a.user_id = b.github_id where username = ? order by gamenum desc limit ? offset ?',
			[user, count, offset]
		),
		conn.execute(
			'select count(*) rowCount from game_results a inner join users b on a.user_id = b.github_id where username = ?',
			[user]
		)
	]);
	const { rows } = results;
	const countRow = countResults.rows.at(0) as { rowCount: number };
	return {
		totalCount: Number(countRow.rowCount),
		results: rows as GameResult[]
	};
};

export const upsertUser = async (user: UserRecord) => {
	const conn = client.connection();
	const { github_id, username } = user;
	const results = await conn.execute(
		'insert into users (github_id, username) values (?, ?) on duplicate key update username = ?',
		[github_id, username, username]
	);
	return results;
};
