export const load: import('./$types').LayoutServerLoad = async (event) => {
	return {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		user: event.locals?.wordLettuceUser
			? {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					login: event.locals?.wordLettuceUser,
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					avatar: event.locals?.profile_url
			  }
			: null
	};
};
