import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = async (event) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const user = event.locals.user;
	if (!user) {
		throw redirect(307, `/login?referrer=${encodeURIComponent('/profile')}`);
	}

	throw redirect(307, `/profile/${user.login}`);
};
