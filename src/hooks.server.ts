import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getUser } from '$lib/util/auth';

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	// const session = event.cookies.get(SESSION_COOKIE_NAME) || '';

	// if (session) {
	// 	const user = await getUser(session);
	// 	event.locals.user = user;
	// }
	const response = await resolve(event);
	return response;
};
