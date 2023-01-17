import type { WordLettuceSession } from '$lib/types/auth';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { fetcher } from 'itty-fetcher';

export const prerender = false;

export type NavLink = {
	path: string;
	name: string;
	enabled: boolean;
	prefetch: boolean;
	margin?: string;
	icon?: string;
};

export const load = async (event: ServerLoadEvent) => {
	const session = (await event.locals.getSession()) as WordLettuceSession;
	const csrfCookieName = `${
		event.request.url.startsWith('https') ? '__Host-' : ''
	}next-auth.csrf-token`;

	const origin = new URL(event.request.url).origin;
	const { csrfToken } = (await fetcher({
		fetch: event.fetch,
		base: origin
	}).get(
		'/auth/csrf',
		{},
		{
			headers: {
				cookie: event.cookies.serialize(csrfCookieName, event.cookies.get(csrfCookieName) || '')
			}
		}
	)) as { csrfToken: string };

	const links: NavLink[] = [
		{
			path: '/',
			name: 'Home',
			enabled: true,
			prefetch: true,
			icon: 'home'
		},
		{
			path: '/rankings',
			name: 'Rankings',
			enabled: true,
			prefetch: true,
			icon: 'trophy'
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
		session,
		csrfToken: csrfToken
	};
};
