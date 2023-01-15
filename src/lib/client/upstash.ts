import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN
});

export const getDBProvider = async () => {
	const now = new Date().getTime();
	console.time(`get key from upstash global redis at ${now}`);
	const dbProvider = await redis.get('dbProvider');
	console.log(dbProvider);
	console.timeEnd(`get key from upstash global redis at ${now}`);
	return dbProvider;
};
