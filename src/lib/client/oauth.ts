import { fetcher } from 'itty-fetcher';

const userURL = 'https://api.github.com/user';
const auth = fetcher();

export type WordLettuceUser = {
	login?: string;
	avatar?: string;
};

export const getUser = async (accessToken: string): Promise<WordLettuceUser> => {
	const empty = {
		login: '',
		avatar: '',
	}
	const user = await auth
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
		.catch(({ status, message }) => {});
	
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { login, avatar_url } = user;
	if (!user || !login || !avatar_url) return empty;
	return {
		login: login || '',
		avatar: avatar_url || ''
	};
};
