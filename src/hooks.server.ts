import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getProfile } from '$lib/util/redis';

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';

	if (session) {
		const user = await getProfile(session);
		if (!user.login) {
			event.cookies.set(SESSION_COOKIE_NAME, '', { httpOnly: true, path: '/' });
		}
		event.locals.user = user;
	}
	const response = await resolve(event);
	return response;
};
