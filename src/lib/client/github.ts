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
	const before = new Date().getTime();
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
		.catch(({ status, message }) => {
			return empty;
		})) as {
		login: string;
		avatar_url: string;
		bio: string;
	};
	const after = new Date().getTime();
	if (!user) {
		return empty;
	}
	console.log('load user profile with access token from github:', after - before);
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
	const before = new Date().getTime();
	const userProfile = (await userInfo.get(`/${user}`)) as {
		login: string;
		avatar_url: string;
		bio: string;
	};
	const after = new Date().getTime();
	console.log('load user profile from github user api', after - before);
	return {
		login: userProfile.login,
		avatar: userProfile.avatar_url,
		bio: userProfile.bio
	} as Profile;
};
