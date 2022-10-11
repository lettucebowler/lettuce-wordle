import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw redirect(307, `/login?referrer=${encodeURIComponent('/profile')}`);
	}

	throw redirect(307, `/profile/${user.login}`);
};
