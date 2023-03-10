import { Client } from '@planetscale/database';
import { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';
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
		'select username, github_id, sum(attempts), count(attempts), (count(attempts) * 7) - sum(attempts) from game_results a inner join users b on a.user_id = b.github_id where gamenum > ? and gamenum <= ? group by user_id order by (count(attempts) * 7) - sum(attempts) desc, username  limit 10',
		[gameNum - 1000, gameNum]
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

export const getGameResults = async (user: string, count: number) => {
	const conn = client.connection();
	const results = await conn.execute(
		'select username, user_id, gamenum, answers, attempts from game_results a inner join users b on a.user_id = b.github_id where username = ? order by gamenum desc limit ?',
		[user, count]
	);
	const { rows } = results;
	return (rows as GameResult[]).map((row: GameResult) => ({
		user: row.username,
		user_id: row.user_id,
		gamenum: row.gamenum,
		answers: row.answers,
		attempts: row.attempts
	})) as GameResult[];
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
