import { fetcher } from 'itty-fetcher';
import { KV_TOKEN, KV_HOST } from '$env/static/private';

const workersKV = fetcher({
	base: KV_HOST,
	transformRequest(req) {
		req.headers['Authorization'] = `Bearer ${KV_TOKEN}`;
		return req;
	}
});

export const get = async (key: string) => {
	const before = new Date().getTime();
	let data = {};
	try {
		data = JSON.parse(await workersKV.post('/get', { key }));
	} catch (e) {
		console.log(e);
	}
	const after = new Date().getTime();
	console.log('load from KV', after - before);
	return data;
};

export const set = async (key: string, value: any) => {
	const before = new Date().getTime();
	const data = await workersKV.post('/set', { key, value });
	const after = new Date().getTime();
	console.log('write to KV', after - before);
	return data;
};

export const getUserKV = (key: string) => get(key) as Promise<{ login?: string; avatar?: string }>;
