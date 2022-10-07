export const handle: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
	const wordLettuceUser = event.cookies.get('wordLettuceUser');
	const profile_url = event.cookies.get('profile_url');
	event.locals.profile_url = profile_url;
	event.locals.wordLettuceUser = wordLettuceUser;
	const response = await resolve(event);
	return response;
};
