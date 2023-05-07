import type { WordLettuceSession } from '$lib/types/auth.js';
import { redirect } from '@sveltejs/kit';

export async function GET(event) {
	const session = (await event.locals.getSession()) as WordLettuceSession;
	const user = session?.user;
	console.log(session);
	if (!user) {
		throw redirect(307, '/auth/signin');
	}

	throw redirect(307, `/profile/${user.login}`);
}
