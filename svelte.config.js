import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			out: 'build',
			runtime: 'edge',
			split: true
		}),
		version: {
			name: Date.now().toString(),
			pollInterval: 5000
		}
	}
};

export default config;
