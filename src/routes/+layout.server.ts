export const prerender = false;
import type { NavLinkProps } from '$lib/types/navigation.js';
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
	return {
		nav: links,
		session: await event.locals.getWordLettuceSession()
	};
}

export const trailingSlash = 'never';
