import type { WordLettuceSession } from '$lib/types/auth';
import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = async (event) => {
	const session = (await event.locals.getSession()) as WordLettuceSession;
	const { user } = session;
	if (!user) {
		throw redirect(307, `/login?referrer=${encodeURIComponent('/profile')}`);
	}

	throw redirect(307, `/profile/${user.login}`);
};
