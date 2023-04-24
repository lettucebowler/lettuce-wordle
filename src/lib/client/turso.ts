import { createClient } from '@libsql/client';
import { TURSO_DB_TOKEN, TURSO_DB_URL } from '$env/static/private';

const config = {
	url: TURSO_DB_URL,
	authToken: TURSO_DB_TOKEN
};

const db = createClient(config);

// export const getGameResults = async (user: string, count: number, offset = 0) => {
// 	const conn = client.connection();
// 	const [results, countResults] = await Promise.all([
// 		conn.execute(
// 			'select username user, user_id, gamenum, answers, attempts from game_results a inner join users b on a.user_id = b.github_id where username = ? order by gamenum desc limit ? offset ?',
// 			[user, count, offset]
// 		),
// 		conn.execute(
// 			'select count(*) rowCount from game_results a inner join users b on a.user_id = b.github_id where username = ?',
// 			[user]
// 		)
// 	]);
// 	const { rows } = results;
// 	const countRow = countResults.rows.at(0);
// 	return {
// 		totalCount: Number(countRow.rowCount),
// 		results: rows as GameResult[]
// 	};
// };

export async function getGameResults(user: string, count: number, offset = 0) {
	console.time('query turso');
	const rs = await db.execute(
		'select * from game_results a inner join users b on a.user_id = b.github_id'
	);
	console.timeEnd('query turso');
}
