import { connect } from '@planetscale/database';
import { DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';

const config = {
	host: DATABASE_HOST,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
};

const conn = connect(config);

export const getResults = async () => {
	console.log('get results');
	const before = new Date();
	const results = await conn.execute('select 1 from dual where 1=?', [1]);
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(duration);
	console.log(results);
	return results;
};

export const saveGameResults = async (user: string, gamenum: number, answers: string[]) => {
	const answerString = answers.join('');
	const results = await conn.execute(
		`insert into gameresults (user, gamenum, answers) values ('${user}', ${gamenum}, '${answerString}') on duplicate key update answers='${answerString}'`
	);
};

export const getGameResults = async (
	user: string,
	currentGameNum: number
): Promise<{ user: string; gamenum: number; answers: string }[]> => {
	const before = new Date();
	const results = await conn.execute(`select * from gameresults where user = '${user}'`);
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`time fetching game results: ${duration}`);
	const { rows } = results;
	return rows || [];
};
