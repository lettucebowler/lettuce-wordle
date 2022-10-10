import { redirect } from '@sveltejs/kit';
import { fetcher } from 'itty-fetcher';
import { CLIENT_ID, CLIENT_SECRET, SESSION_COOKIE_NAME } from '$env/static/private';
import { stashProfile } from '$lib/util/redis';

import { getUser } from '$lib/util/auth';
const tokenUrl = 'https://github.com/login/oauth/access_token';

const auth = fetcher();

const getAccessToken = async (code: string): Promise<string> => {
	const response: {
		access_token: string;
		token_type: string;
		scope: string;
	} = await auth.post(
		tokenUrl,
		{
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			code
		},
		{
			headers: {
				['Accept']: 'application/json'
			}
		}
	);
	const access_token = response.access_token;
	return access_token as string;
};

export const GET: import('./$types').RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const accessToken = await getAccessToken(code || '');
	const user = await getUser(accessToken);
	await stashProfile(accessToken, user);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	event.cookies.set(SESSION_COOKIE_NAME, accessToken, {
		httpOnly: true,
		path: '/',
		maxAge: 86400 * 7
	});
	throw redirect(302, '/');
};
