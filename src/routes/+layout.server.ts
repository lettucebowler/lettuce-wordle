export async function load(event) {
	return {
		props: {
			user: event.locals.wordLettuceUser,
			avatar: event.locals.profile_url
		}
	};
}
