import { getAuthUser } from '$lib/util/auth';

export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	await getAuthUser(event);
	const response = await resolve(event);
	return response;
};
