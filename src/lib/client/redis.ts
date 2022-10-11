import { Redis } from '@upstash/redis';
import { AUTH_REDIS_REST_TOKEN, AUTH_REDIS_URL } from '$env/static/private';

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
	redis.expire(accessToken, 900);
	const afterProfile = new Date();
	const profileDuration = afterProfile.getTime() - beforeProfile.getTime();
	console.log(`getting cached profile: ${profileDuration}`);
	return profile;
};

export const stashProfile = async (accessToken: string, profile: any) => {
	const status = await redis.set(`${accessToken}`, profile, { ex: 900 });

	return status;
};

export const cleanupProfile = async (accessToken: string) => {
	const status = await redis.del(`${accessToken}`);
	return status;
};
