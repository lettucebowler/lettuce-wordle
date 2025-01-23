import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), tailwindcss()],
	build: {
		assetsInlineLimit: 1024
	}
};

export default config;
