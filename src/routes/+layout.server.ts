export const prerender = false;
import type { NavLinkProps } from '$lib/types.js';
export async function load(event) {
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
	return {
		nav: links,
		session: auth
	};
}

export const trailingSlash = 'never';
