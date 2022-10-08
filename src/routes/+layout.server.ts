export const load: import('./$types').LayoutServerLoad = async (event) => {
	const { login, avatar_url }: { login: string; avatar_url: string } = event.locals?.user || {};

	return {
		user:
			login && avatar_url
				? {
						login,
						avatar: avatar_url
				  }
				: null
	};
};
