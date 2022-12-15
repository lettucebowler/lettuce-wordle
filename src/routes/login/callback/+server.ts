import { redirect } from '@sveltejs/kit';
import { fetcher } from 'itty-fetcher';
import { CLIENT_ID, CLIENT_SECRET, SESSION_COOKIE_NAME } from '$env/static/private';
import { getGameNum } from '$lib/util/share';
import { getUserFromSession } from '$lib/client/github';
import { checkWords } from '$lib/util/gameFunctions';
import { getDailyWord } from '$lib/util/words';
import { stashProfile } from '$lib/util/auth';
import { saveGameResults } from '$lib/util/gameresults';

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
	const user = await getUserFromSession(accessToken, event.fetch);
	stashProfile(accessToken, user, event.locals.authProvider);
	const gameState = event.locals.gameState;
	let answers: string[] = [];
	if (gameState.length) {
		answers = checkWords(gameState, getDailyWord());
	}
	if (user.login && answers.length && answers.at(-1) === 'xxxxx') {
		const gameResult = {
			user: user.login,
			gamenum: getGameNum(),
			answers: answers.join('')
		};
		await saveGameResults(gameResult, event.locals.dbProvider);
	}
	event.cookies.set(SESSION_COOKIE_NAME, accessToken, {
		httpOnly: true,
		path: '/',
		maxAge: 86400 * 7
	});
	throw redirect(307, '/');
};
