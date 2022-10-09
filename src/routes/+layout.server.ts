import type { WordLettuceUser } from '$lib/util/auth';

export const load: import('./$types').LayoutServerLoad = async (event) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let user: WordLettuceUser = event.locals.user || {};
	const { login, avatar } = user;

	return {
		user: {
			login: login || '',
			avatar: avatar || ''
		}
	};
};
