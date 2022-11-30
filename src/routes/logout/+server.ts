import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';
import { cleanupProfile } from '$lib/client/redis';

export const GET: import('./$types').RequestHandler = async (req) => {
	const session = req.cookies.get(SESSION_COOKIE_NAME) || '';
	if (session) {
		req.cookies.set(SESSION_COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 86400 * 7 });
		cleanupProfile(session);
	}
	throw redirect(302, '/');
};
