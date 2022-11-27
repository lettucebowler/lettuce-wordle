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
	const data = await workersKV.post('/get', { key });
	const after = new Date().getTime();
	console.log('load from KV', after - before);
	return data;
};
