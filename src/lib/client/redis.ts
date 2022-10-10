import { fetcher } from 'itty-fetcher';
import { Redis } from '@upstash/redis';
import { AUTH_REDIS_REST_TOKEN, AUTH_REDIS_URL } from '$env/static/private';

// const redis = fetcher({
// 	base: AUTH_REDIS_URL,
// 	transformRequest(req) {
// 		req.headers = {
// 			...req.headers,
// 			Authorization: `Bearer ${AUTH_REDIS_REST_TOKEN}`
// 		};
// 		return req;
// 	}
// });

const redis = new Redis({
	url: AUTH_REDIS_URL,
	token: AUTH_REDIS_REST_TOKEN
});

export const getProfile = async (
	accessToken: string
): Promise<{ login?: string; profile_url?: string }> => {
	if (!accessToken) return {};

	let profile = {};
	const beforeProfile = new Date();
	profile = (await redis.get(`${accessToken}`)) || profile;
	const afterProfile = new Date();
	const profileDuration = afterProfile.getTime() - beforeProfile.getTime();
	console.log(`getting cached profile: ${profileDuration}`);
	return profile;
};

export const stashProfile = async (accessToken: string, profile: any) => {
	// const status = await redis.post(`/set/${accessToken}?EX=86400`, profile);
	const status = await redis.set(`${accessToken}`, profile, { ex: 86400 });

	return status;
};

export const cleanupProfile = async (accessToken: string) => {
	// const status = await redis.get(`/del/${accessToken}`);
	const status = await redis.del(`${accessToken}`);
	return status;
};
