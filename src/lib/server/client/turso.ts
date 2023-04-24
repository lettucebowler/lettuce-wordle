import { createClient } from '@libsql/client/web';
import { TURSO_DB_TOKEN, TURSO_DB_URL } from '$env/static/private';
import { gameResultSchema } from '$lib/types/gameresult';

const config = {
	url: TURSO_DB_URL,
	authToken: TURSO_DB_TOKEN
};

const db = createClient(config);
const gameResultListSchema = gameResultSchema.array();
export async function getGameResults(user: string, count: number, offset = 0) {
	const [gameResults, countResults] = await Promise.all([
		db.execute(
			'select user_id, answers, gamenum, attempts, username user from game_results a inner join users b on a.user_id = b.github_id'
		),
		db.execute({
			sql: 'select count(*) rowCount from game_results a inner join users b on a.user_id = b.github_id where username = ?',
			args: [user],
		})
	]);
	const resultsValidation = gameResultListSchema.safeParse(gameResults.rows);
	const results = resultsValidation.success ? resultsValidation.data : [];
	const rowCount = countResults.rows.at(0)?.rowCount || 0;
	return {
		results,
		totalCount: rowCount,
	};
}