import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';

export const GET: import('./$types').RequestHandler = async (req) => {
	req.locals.user = null;
	req.cookies.set(SESSION_COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 86400 * 7 });
	throw redirect(302, '/');
};
