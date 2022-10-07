export const load: import('./$types').LayoutServerLoad = async (event) => {
	return {
		user: event.locals?.wordLettuceUser
			? {
					login: event.locals?.wordLettuceUser,
					avatar: event.locals?.profile_url
			  }
			: null
	};
};
