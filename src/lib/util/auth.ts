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
	console.log(profile);
	return profile as Profile;
};

export const stashProfile = async (session: string, user: Profile, provider: string) => {
	switch (provider) {
		case 'upstash':
			stashProfileUpstash(session, user);
			break;
		case 'kv':
			stashProfileKV(session, user);
			break;
		default:
			throw Error('invalid provider');
	}
};
