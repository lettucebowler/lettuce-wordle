import { fetcher } from 'itty-fetcher';
import { AUTH_REDIS_REST_TOKEN, AUTH_REDIS_URL } from '$env/static/private';

const redis = fetcher({
	base: AUTH_REDIS_URL,
	transformRequest(req) {
		req.headers = {
			...req.headers,
			Authorization: `Bearer ${AUTH_REDIS_REST_TOKEN}`
		};
		return req;
	}
});

export const getProfile = async (
	accessToken: string
): Promise<{ login?: string; profile_url?: string }> => {
	if (!accessToken) return {};
	const profileResult: { result: string } = await redis.get(`/get/${accessToken}`);
	const { result } = profileResult;
	let profile = {};

	if (!result) {
		return profile;
	}
	try {
		profile = JSON.parse(result);
	} catch {
		return profile;
	}
	return profile;
};

export const stashProfile = async (accessToken: string, profile: any) => {
	const status = await redis.post(`/set/${accessToken}?EX=86400`, profile);
	return status;
};

export const cleanupProfile = async (accessToken: string) => {
	const status = await redis.get(`/del/${accessToken}`);
	return status;
};
