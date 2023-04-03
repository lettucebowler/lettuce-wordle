import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = async (event) => {
	const { session } = await event.parent();
	const user = session?.user;
	if (!user) {
		throw redirect(307, `/login?referrer=${encodeURIComponent('/profile')}`);
	}

	throw redirect(307, `/profile/${user.login}`);
};
