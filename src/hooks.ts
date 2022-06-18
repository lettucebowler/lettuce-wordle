import cookie from 'cookie';
import {prerendering} from '$app/env'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (!prerendering) {
        const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	    const state = JSON.parse(cookies.state || JSON.stringify({}));

        console.log('state');
        console.log(state);

	    event.locals = { state };
    } else {
        console.log('prerendering');
    }

	const response = await resolve(event);

	return response;
}
