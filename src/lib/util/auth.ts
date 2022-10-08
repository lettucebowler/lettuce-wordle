import { fetcher } from 'itty-fetcher';

const userURL = 'https://api.github.com/user';
const auth = fetcher();

export const getUser = async (accessToken: string) => {
	const user = await auth.get(
		userURL,
		{},
		{
			headers: {
				['Accept']: 'application/json',
				['Authorization']: `Bearer ${accessToken}`
			}
		}
	);
	return user as {
		login: string;
	};
};
