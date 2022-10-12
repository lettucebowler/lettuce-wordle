import { connect } from '@planetscale/database';
import { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';

const config = {
	host: DATABASE_HOST,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
};

const conn = connect(config);

export const saveGameResults = async (user: string, gamenum: number, answers: string[]) => {
	const answerString = answers.join('');
	const results = await conn.execute(
		`insert into gameresults (user, gamenum, answers, attempts) values ('${user}', ${gamenum}, '${answerString}', '${Math.floor(
			answerString.length / 5
		)}') on duplicate key update answers='${answerString}'`
	);
	return results;
};

export const getInfoForLeaderBoard = async (
	gameNum: number
): Promise<
	{
		user: string;
		sum: number;
		count: number;
		score: number;
	}[]
> => {
	const before = new Date();
	const results = await conn.execute(
		`select user, sum(attempts), count(attempts), 42 - sum(attempts) from gameresults where gamenum > (${
			gameNum - 7
		}) group by user order by 42 - sum(attempts) limit 10`
	);
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`time fetching scores: ${duration}`);
	const { rows } = results;

	const scores = rows.map((row) => {
		const [user, sum, count, score] = Object.values(row);
		return {
			user,
			sum,
			count,
			score
		};
	});
	return scores;
};

export const getGameResults = async (
	user: string,
	currentGameNum: number
): Promise<{ user: string; gamenum: number; answers: string; attempts: number }[]> => {
	const before = new Date();
	const results = await conn.execute(
		`select * from gameresults where user = '${user}' and gamenum > ${currentGameNum - 7}`
	);
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`time fetching game results: ${duration}`);
	const { rows } = results;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return rows || [];
};
