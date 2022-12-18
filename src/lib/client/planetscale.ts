import { Client } from '@planetscale/database';
import { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';
import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';
import LetterPageContentContainer from '$lib/components/LetterPageContentContainer.svelte';

const config = {
	host: DATABASE_HOST,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
};

const client = new Client(config);

export const saveGameResults = async ({ user, gamenum, answers }: GameResult) => {
	const conn = client.connection();
	const results = await conn.execute(
		`insert into gameresults (user, gamenum, answers, attempts) values ('${user}', ${gamenum}, '${answers}', '${Math.floor(
			answers.length / 5
		)}') on duplicate key update answers='${answers}', attempts='${Math.floor(answers.length / 5)}'`
	);
	return results;
};

export const getLeaderBoardResults = async (gameNum: number) => {
	const conn = client.connection();
	const results = await conn.execute(
		`select user, sum(attempts), count(attempts), (count(attempts) * 7) - sum(attempts) from gameresults where gamenum > (${
			gameNum - 7
		}) group by user order by (count(attempts) * 7) - sum(attempts) desc limit 10`
	);
	const { rows } = results;

	const scores = rows.map((row) => {
		const [user, sum, count, score] = Object.values(row);
		return {
			user,
			sum: parseInt(sum),
			count: parseInt(count),
			score: parseInt(score)
		};
	});
	return scores as LeaderboardResults[];
};

export const getGameResults = async (user: string, count: number) => {
	const conn = client.connection();
	// const results = await conn.execute(
	// 	`select * from gameresults where user = '${user}' order by gamenum desc limit ${count}`
	// );
	const results = await conn.execute(
		'select username, user_id, gamenum, answers, attempts from gameresults a inner join users b on a.user_id = b.github_id where username = ? order by gamenum desc limit ?',
		[user, count]
	);
	const { rows } = results;
	return rows.map((row) => ({
		user: row.username,
		user_id: row.user_id,
		gamenum: row.gamenum,
		answers: row.answers,
		attempts: row.attempts
	})) as GameResult[];
};

export const updateUsername = async (githubId: number, username: string) => {
	const conn = client.connection();
	console.log(githubId);
	console.log(username);
	const results = await conn.execute(
		'insert into users (github_id, username) values (?, ?) on duplicate key update username = ?',
		[githubId, username, username]
	);
	return results;
};
