import {
	getProfile as getProfileKV,
	stashProfile as stashProfileKV
} from '$lib/client/apiWordlettuce';
import {
	getProfile as getProfileUpstash,
	stashProfile as stashProfileUpstash
} from '$lib/client/upstash';

import type { Profile } from '$lib/types/auth';

export const getProfile = async (session: string, provider = 'cf') => {
	let profile = {};
	switch (provider) {
		case 'upstash':
			profile = await getProfileUpstash(session);
			break;
		default:
			profile = await getProfileKV(session);
			break;
	}
	return profile as Profile;
};

export const stashProfile = async (session: string, user: Profile, provider = 'cf') => {
	switch (provider) {
		case 'upstash':
			stashProfileUpstash(session, user);
			break;
		default:
			stashProfileKV(session, user);
			break;
	}
};
