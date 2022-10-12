import { fetcher } from 'itty-fetcher';

const userURL = 'https://api.github.com/user';

export type WordLettuceUser = {
	login?: string;
	avatar?: string;
	bio?: string;
};

export const getUser = async (
	accessToken: string,
	fetchImplementation: any = fetch
): Promise<WordLettuceUser> => {
	const auth = fetcher({ fetch: fetchImplementation });
	const empty = {
		login: '',
		avatar: ''
	};
	const before = new Date();
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
	const after = new Date();
	const duration = after.getTime() - before.getTime();
	console.log(`time fetching user from oauth2 provider: ${duration}`);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { login, avatar_url } = user || empty;
	if (!user || !login || !avatar_url) return empty;
	return {
		login: login || '',
		avatar: avatar_url || ''
	};
};
