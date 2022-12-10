import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';

export const GET: import('./$types').RequestHandler = async (req) => {
	const session = req.cookies.get(SESSION_COOKIE_NAME) || '';
	if (session) {
		req.cookies.set(SESSION_COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 86400 * 7 });
	}
	throw redirect(302, '/');
};
