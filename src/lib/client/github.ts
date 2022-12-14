import { fetcher } from 'itty-fetcher';

const userURL = 'https://api.github.com/user';

import type { Profile } from '$lib/types/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const getUserFromSession = async (
	accessToken: string,
	fetchImplementation: (
		input: RequestInfo | URL,
		init?: RequestInit | undefined
	) => Promise<Response> = fetch
) => {
	const auth = fetcher({ fetch: fetchImplementation });
	const empty: Profile = {
		login: '',
		avatar: '',
		bio: ''
	};
	const before = new Date();
	const user = (await auth
		.get(
			userURL,
			{},
			{
				headers: {
					['Accept']: 'application/json',
					['Authorization']: `Bearer ${accessToken}`
				}
			}
		)
		.catch((e) => console.log(e))) as {
		login: string;
		avatar_url: string;
		bio: string;
	};
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`time fetching user from oauth2 provider: ${duration}`);
	return {
		...empty,
		login: user.login || '',
		avatar: user.avatar_url || '',
		bio: user.bio
	} as Profile;
};

export const getUserProfile = async (event: RequestEvent, user: string) => {
	const userInfo = fetcher({
		base: 'https://api.github.com/users',
		fetch: event.fetch
	});

	const userProfile = (await userInfo.get(`/${user}`)) as {
		login: string;
		avatar_url: string;
		bio: string;
	};
	return {
		login: userProfile.login,
		avatar: userProfile.avatar_url,
		bio: userProfile.bio
	} as Profile;
};