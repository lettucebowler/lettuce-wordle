import { fetcher } from 'itty-fetcher';

import { browser } from '$app/environment';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, fetch }) => {
	if (browser && !data.csrfToken) {
		const { csrfToken } = (await fetcher({ fetch }).get(window.location.origin + '/auth/csrf')) as {
			csrfToken: string;
		};
		return {
			...data,
			csrfToken
		};
	}
	return {
		...data
	};
};
