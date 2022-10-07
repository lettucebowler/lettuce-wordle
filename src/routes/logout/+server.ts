import { redirect } from '@sveltejs/kit';

export const GET: import('./$types').RequestHandler = async (req) => {
	req.locals.wordLettuceUser = null;
	req.locals.profile_url = null;
	req.cookies.set('wordLettuceUser', '', { httpOnly: true, path: '/' });
	req.cookies.set('profile_url', '', { httpOnly: true, path: '/' });
	throw redirect(302, '/');
};
