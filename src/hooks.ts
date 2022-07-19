import cookie from 'cookie';
import { prerendering } from '$app/env';
import { decodeState } from '$lib/util/state';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (!prerendering) {
		const cookies = cookie.parse(event.request.headers.get('cookie') || '');

		const state = decodeState(cookies.state);

		event.locals = { state };
	} else {
		event.locals = { state: {} };
	}

	const response = await resolve(event);

	return response;
}
