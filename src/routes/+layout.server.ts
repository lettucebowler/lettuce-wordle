import { prerendering } from '$app/environment';
import type { WordLettuceUser } from '$lib/client/oauth';

export const prerender = false;

export const load: import('./$types').LayoutServerLoad = async (event) => {
	if (!prerendering) {
		const city = decodeURIComponent(event.request.headers.get('x-vercel-ip-city') || '');
		const ip = event.getClientAddress();
		console.log({
			city,
			ip
		});
	}
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
