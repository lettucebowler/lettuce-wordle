import { getUser } from '$lib/util/auth';
import { SESSION_COOKIE_NAME } from '$env/static/private';

export const load: import('./$types').LayoutServerLoad = async (event) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';
	let user = {};
	if (session) {
		user = await getUser(session);
	}
	const { login, avatar_url }: { login: string; avatar_url: string } = user;

	return {
		user: {
			login: login || '',
			avatar: avatar_url || ''
		}
	};
};
