import { fetcher } from 'itty-fetcher';

const userURL = 'https://api.github.com/user';
const auth = fetcher();

export type WordLettuceUser = {
	login?: string;
	avatar?: string;
};

export const getUser = async (accessToken: string): Promise<WordLettuceUser> => {
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
	const { login, avatar_url } = user;
	return {
		login: login || '',
		avatar: avatar_url || ''
	};
};
