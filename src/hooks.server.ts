import { getAuthUser } from '$lib/util/auth.server';

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	await getAuthUser(event);
	const response = await resolve(event);
	return response;
};

export const handleFetch: import('@sveltejs/kit').HandleFetch = async (event) => {
	if (event.request.url.startsWith('https://github.com')) {
		// Workaround: https://github.com/sveltejs/kit/issues/6608
		event.request.headers.set('origin', event.request.url);
	}

	return fetch(event.request);
};
