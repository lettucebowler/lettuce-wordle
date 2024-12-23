export const prerender = false;
import type { NavLinkProps } from '$lib/types.js';
import { getGameNum } from '$lib/util/words.js';
export async function load(event) {
	event.depends('data:gamenum');
	const links: NavLinkProps[] = [
		{
			path: '/',
			name: 'Home',
			enabled: true,
			prefetch: true
		},
		{
			path: '/rankings',
			name: 'Rankings',
			enabled: true,
			prefetch: true
		},
		{
			path: '/about',
			name: 'About',
			enabled: true,
			prefetch: true
		}
	];
	const auth = await event.locals.auth();
	const gameNum = getGameNum();
	return {
		nav: links,
		session: auth,
		gameNum
	};
}

export const trailingSlash = 'never';
