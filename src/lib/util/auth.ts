import { fetcher } from 'itty-fetcher';

const userURL = 'https://api.github.com/user';
const auth = fetcher();

export const getUser = async (accessToken: string) => {
	let user = {
		login: '',
		avatar: ''
	};
	user = await auth
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
	return user as {
		login: string;
	};
};
