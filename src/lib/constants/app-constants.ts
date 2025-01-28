import type { CookiesOptions } from '@auth/core/types';

export const appName = 'WordLettuce';
export const successAnswer = 'xxxxx';
export const STATE_COOKIE_NAME_V2 = 'wordlettuce-state';
export const STATE_COOKIE_SETTINGS = {
	httpOnly: false,
	path: '/',
	maxAge: 86400,
	secure: false,
	sameSite: 'Lax'
};
