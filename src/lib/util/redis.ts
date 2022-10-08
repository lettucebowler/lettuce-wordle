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

export const getProfile = async (accessToken: string) => {
	const profileResult: { result: string } = await redis.get(`/get/${accessToken}`);
	const { result } = profileResult;
	const profile = JSON.parse(result);
	return profile;
};

export const stashProfile = async (accessToken: string, profile: any) => {
	const status = await redis.post(`/set/${accessToken}`, profile);
	return status;
};
