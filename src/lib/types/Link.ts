import type { IconSource } from '@steeze-ui/svelte-icon/types';

export type NavLink = {
	path: string;
	name: string;
	enabled: boolean;
	prefetch: boolean;
	margin?: string;
	icon?: IconSource;
};
