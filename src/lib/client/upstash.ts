import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

type Profile = { login?: string; profile_url?: string };

const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN
});

export const getProfile = async (accessToken: string): Promise<Profile> => {
	if (!accessToken) return {};

	let profile = {};
	const beforeProfile = new Date();
	profile = (await redis.get(`${accessToken}`)) || profile;
	redis.expire(accessToken, 900);
	const afterProfile = new Date();
	const profileDuration = afterProfile.getTime() - beforeProfile.getTime();
	console.log('load profile from upstash: ', profileDuration);
	return profile;
};

export const stashProfile = async (accessToken: string, profile: Profile) => {
	const status = await redis.set(`${accessToken}`, profile, { ex: 900 });

	return status;
};

export const cleanupProfile = async (accessToken: string) => {
	const status = await redis.del(`${accessToken}`);
	return status;
};
