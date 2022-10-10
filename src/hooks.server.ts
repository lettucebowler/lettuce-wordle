import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getProfile, stashProfile } from '$lib/util/redis';
import { getUser } from '$lib/util/auth';

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';

	if (session) {
		let user = await getProfile(session);
		if (!user.login) {
			user = await getUser(session);
			await stashProfile(session, user);
		}
		if (!user.login) {
			event.cookies.delete(SESSION_COOKIE_NAME);
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		event.locals.user = user;
	}
	const response = await resolve(event);
	return response;
};
