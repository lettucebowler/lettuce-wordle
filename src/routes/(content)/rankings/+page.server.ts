import { delay } from '../utils.js';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';

export async function load(event) {
	const { getRankings } = createApiWordlettuceClient(event);
	const rankings = getRankings();
	const result = await Promise.race([delay(100), rankings]);

	return {
		leaderboard: {
			scores: !event.isDataRequest ? await rankings : result ? result : rankings
		}
	};
}
