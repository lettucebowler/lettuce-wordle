import { fetcher } from 'itty-fetcher';
import { API_GITHUB_HOST } from '$env/static/private';

const userURL = 'https://api.github.com/user';

import type { Profile, UserProfile } from '$lib/types/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const getUserFromSession = async (
	accessToken: string,
	fetchImplementation: (
		input: RequestInfo | URL,
		init?: RequestInit | undefined
	) => Promise<Response> = fetch
) => {
	const auth = fetcher({ fetch: fetchImplementation, base: API_GITHUB_HOST });
	const empty: Profile = {
		login: '',
		avatar: '',
		bio: ''
	};
	const before = new Date().getTime();
	const user = (await auth
		.get(
			'/user',
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
