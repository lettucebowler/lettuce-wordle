import { fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_TOKEN, API_WORDLETTUCE_HOST } from '$env/static/private';

const workersKV = fetcher({
	base: `${API_WORDLETTUCE_HOST}/api/auth`,
	transformRequest(req) {
		req.headers['Authorization'] = `Bearer ${API_WORDLETTUCE_TOKEN}`;
		return req;
	}
});

export const get = async (key: string) => {
	const before = new Date().getTime();
	let data = {};
	try {
		data = await workersKV.post('/get', { session: key });
	} catch (e) {
		console.log(e);
	}
	const after = new Date().getTime();
	console.log('load from KV', after - before);
	return data;
};

export const set = async (key: string, value: any) => {
	const data = await workersKV.post('/set', { session: key, profile: value });
	return data;
};

export const getUserKV = (key: string) => get(key) as Promise<{ login?: string; avatar?: string }>;
