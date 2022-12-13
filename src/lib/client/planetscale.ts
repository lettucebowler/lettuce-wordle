import { connect } from '@planetscale/database';
import { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';
import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';

const config = {
	host: DATABASE_HOST,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
};

const conn = connect(config);

export const saveGameResults = async ({ user, gamenum, answers }: GameResult) => {
	const before = new Date();
	const results = await conn.execute(
		`insert into gameresults (user, gamenum, answers, attempts) values ('${user}', ${gamenum}, '${answers}', '${Math.floor(
			answers.length / 5
		)}') on duplicate key update answers='${answers}', attempts='${answers.length}'`
	);
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`time to save game results: ${duration}`);
	return results;
};

export const getLeaderBoardResults = async (gameNum: number) => {
	const before = new Date();
	const results = await conn.execute(
		`select user, sum(attempts), count(attempts), (count(attempts) * 7) - sum(attempts) from gameresults where gamenum > (${
			gameNum - 7
		}) group by user order by (count(attempts) * 7) - sum(attempts) desc limit 10`
	);
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log('fetch leaderboard results from planetscale:', duration);
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
	const before = new Date();
	const results = await conn.execute(
		`select * from gameresults where user = '${user}' order by gamenum desc limit ${count}`
	);
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`get last ${count} game results from planetscale for ${user}`, duration);
	const { rows } = results;
	return rows as GameResult[];
};
