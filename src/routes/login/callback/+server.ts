import { redirect } from '@sveltejs/kit';
import { fetcher } from 'itty-fetcher';
import { CLIENT_ID, CLIENT_SECRET, SESSION_COOKIE_NAME } from '$env/static/private';
import { stashProfile } from '$lib/client/redis';
import { getGameNum } from '$lib/util/share';
import { getUser } from '$lib/client/oauth';
import { saveGameResults } from '$lib/client/planetscale';
import { checkWords } from '$lib/util/gameFunctions';
import { getDailyWord } from '$lib/util/words';

const tokenUrl = 'https://github.com/login/oauth/access_token';

const getAccessToken = async (
	code: string,
	fetchImplementation: (
		input: RequestInfo | URL,
		init?: RequestInit | undefined
	) => Promise<Response> = fetch
): Promise<string> => {
	const auth = fetcher({ fetch: fetchImplementation });
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
				Accept: 'application/json'
			}
		}
	);
	const access_token = response.access_token;
	return access_token as string;
};

export const GET: import('./$types').RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const error = event.url.searchParams.get('error');
	if (error) {
		throw redirect(307, '/');
	}
	const accessToken = await getAccessToken(code || '', event.fetch);
	const user = await getUser(accessToken, event.fetch);
	stashProfile(accessToken, user);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const gameState = event.locals.gameState;
	let answers: string[] = [];
	if (gameState.length) {
		answers = checkWords(gameState, getDailyWord());
	}
	if (user.login && answers.length && answers.at(-1) === 'xxxxx') {
		await saveGameResults(user.login, getGameNum(), answers);
	}
	event.cookies.set(SESSION_COOKIE_NAME, accessToken, {
		httpOnly: true,
		path: '/',
		maxAge: 86400 * 7
	});
	throw redirect(307, '/');
};
