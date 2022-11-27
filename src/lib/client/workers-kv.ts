import cloudFlareWorkersKV from '@kikobeats/cloudflare-workers-kv';
import { dev } from '$app/environment';

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

export const get = async (key: string, platform = null) => {
	const before = new Date();
	const json = dev && !platform ? await store.get(key) : null;
	const after = new Date();
	console.log('fetch profile from cloudflare-kv', after.getTime() - before.getTime());
	return json;
};

export const set = async (key: string, value: any) => {
	const json = JSON.stringify(value);
	await store.set(key, json, 900000);
};
