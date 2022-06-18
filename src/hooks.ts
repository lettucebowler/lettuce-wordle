import cookie from 'cookie';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	const state = JSON.parse(cookies.state || JSON.stringify({}));

    console.log('state');
    console.log(state);

	event.locals = { state };

	const response = await resolve(event);

	return response;
}
