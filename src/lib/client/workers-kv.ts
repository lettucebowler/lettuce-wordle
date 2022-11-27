import cloudFlareWorkersKV from '@kikobeats/cloudflare-workers-kv';

import {
	CLOUDFLARE_TOKEN as key,
	CLOUDFLARE_ACCOUNT_ID as accountId,
	CLOUDFLARE_KV_NAMESPACE as namespaceId
} from '$env/static/private';

const store = cloudFlareWorkersKV({
	accountId,
	key,
	namespaceId
});

export const get = async (key: string) => {
	const before = performance.now();
	const json = await store.get(key);
	const after = performance.now();
	console.log('fetch profile from cloudflare-kv', after - before);
	return json;
};

export const set = async (key: string, value: any) => {
	const json = JSON.stringify(value);
	await store.set(key, json, 900000);
};
