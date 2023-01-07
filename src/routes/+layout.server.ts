import type { WordLettuceSession } from '$lib/types/auth';
import { Trophy, Home } from '@steeze-ui/heroicons';
import type { IconSource } from '@steeze-ui/svelte-icon/types';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { AUTH_SECRET as secret } from '$env/static/private';
import { createCSRFToken } from '../../node_modules/@auth/core/src/lib/csrf-token';

export const prerender = false;

export type NavLink = {
	path: string;
	name: string;
	enabled: boolean;
	prefetch: boolean;
	margin?: string;
	icon?: IconSource;
};

export const load = async (event: ServerLoadEvent) => {
	const session = (await event.locals.getSession()) as WordLettuceSession;
	const csrfCookieName = `${
		event.request.url.startsWith('https') ? '__Host-' : ''
	}next-auth.csrf-token`;
	const csrfCookieValue = event.cookies.get(csrfCookieName);
	const csrf = await createCSRFToken({
		// @ts-ignore
		options: {
			secret
		},
		cookieValue: csrfCookieValue,
		isPost: false,
		bodyValue: undefined
	});
	if (csrf.cookie) {
		event.cookies.set(csrfCookieName, csrf.cookie);
	}
	const links: NavLink[] = [
		{
			path: '/',
			name: 'Home',
			enabled: true,
			prefetch: true,
			icon: Home
		},
		{
			path: '/rankings',
			name: 'Rankings',
			enabled: true,
			prefetch: true,
			icon: Trophy
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
		csrfToken: csrf.csrfToken
	};
};
