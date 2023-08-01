export const prerender = false;

import type { WordLettuceSession } from '$lib/types/auth';
import type { NavLinkProps } from '$lib/types/navigation.js';
export async function load(event) {
	const session = (await event.locals.getSession()) as WordLettuceSession;
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
		session
	};
}
