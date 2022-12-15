import {
	getProfile as getProfileKV,
	stashProfile as stashProfileKV
} from '$lib/client/apiWordlettuce';
import {
	getProfile as getProfileUpstash,
	stashProfile as stashProfileUpstash
} from '$lib/client/upstash';

import type { Profile } from '$lib/types/auth';

export const getProfile = async (session: string, provider: string) => {
	const before = new Date().getTime();
	let profile = {};
	switch (provider) {
		case 'upstash':
			profile = await getProfileUpstash(session);
			break;
		case 'kv':
			profile = await getProfileKV(session);
			break;
		default:
			throw Error('invalid provider');
	}
	const after = new Date().getTime();
	console.log(`load profile from ${provider}:`, after - before);
	return profile as Profile;
};

export const stashProfile = async (session: string, user: Profile, provider: string) => {
	const before = new Date().getTime();
	const providers: Map<string, (session: string, profile: Profile) => Promise<Profile>> = new Map([
		['upstash', stashProfileUpstash],
		['kv', stashProfileKV]
	]);
	let result;
	if (provider === 'all') {
		const stashFunctions = Array.from(providers.values());
		for (const stashFunction of stashFunctions) {
			await stashFunction(session, user);
		}
		result = user;
	} else {
		const stashFunction = providers.get(provider);
		if (!stashFunction) {
			throw Error('invalid provider');
		}
		await stashFunction(session, user);
		result = user;
	}
	const after = new Date().getTime();
	console.log(`stash profile to ${provider}:`, after - before);
	return user;
};
