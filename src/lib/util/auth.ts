import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';

import { getProfile, stashProfile } from '$lib/client/redis';
import { getUser } from '$lib/client/oauth';

export const getAuthUser = async (event: ServerLoadEvent | RequestEvent) => {
	const session = event.cookies.get(SESSION_COOKIE_NAME) || '';

	if (session && !event.locals.user) {
		let refresh = false;
		// try and grab caches profile
		let user = await getProfile(session);
		if (!user.login) {
			// grab from origin if cache miss
			console.log('get user');
			user = await getUser(session);
			refresh = true;
		}
		// cache profile again if found
		if (refresh) {
			await stashProfile(session, user);
		}
		// clear session cookie if no profile is available with it any longer
		if (!user.login) {
			event.cookies.delete(SESSION_COOKIE_NAME);
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		event.locals.user = user;
	}
};
