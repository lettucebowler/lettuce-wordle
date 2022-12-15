import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';
import type { Profile } from '$lib/types/auth';

const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN
});

export const getProfile = async (accessToken: string) => {
	if (!accessToken) return {} as Profile;

	let profile = {};
	profile = (await redis.get(`${accessToken}`)) || profile;
	redis.expire(accessToken, 900);
	return profile as Profile;
};

export const stashProfile = async (accessToken: string, profile: Profile) => {
	await redis.set(`${accessToken}`, profile, { ex: 900 });
	return profile;
};
