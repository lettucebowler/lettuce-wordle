export const load: import('./$types').LayoutServerLoad = async (event) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { login, avatar_url }: { login: string; avatar_url: string } = event.locals?.user || {};

	return {
		user: {
			login: login || '',
			avatar: avatar_url || ''
		}
	};
};
