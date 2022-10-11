import {
	CLOUDFLARE_TOKEN,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_KV_NAMESPACE_ID
} from '$env/static/private';
import { fetcher } from 'itty-fetcher';

const kv = fetcher({
	base: `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_NAMESPACE_ID}`,
	transformRequest(req) {
		req.headers = {
			...req.headers,
			['X-Auth-Email']: 'lettucebowler@gmail.com',
			['X-Auth-Key']: CLOUDFLARE_TOKEN
		};
		return req;
	}
});

export const readKV = async (key: string) => {
	const before = new Date();
	const results = await kv.get('/values/bleh');
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`time fetching from cloudflare kv: ${duration}`);
	console.log(results);
	return results;
};
