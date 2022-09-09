import cookie from 'cookie';
import { prerendering } from '$app/environment';
import { decodeState } from '$lib/util/state';

/** @type {import('@sveltejs/kit').Handle} */
export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	if (!prerendering) {
		const cookies = cookie.parse(event.request.headers.get('cookie') || '');

		const state = decodeState(cookies.state);

		event.locals = { state };
	} else {
		event.locals = { state: {} };
	}

	const response = await resolve(event);

	return response;
};
