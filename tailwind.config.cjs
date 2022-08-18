/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			transparent: 'transparent',
			polar: {
				100: '#2E3440',
				200: '#3B4252',
				300: '#434C5E',
				400: '#4C566A',
			},
			snow: {
				100: '#D8DEE9',
				200: '#E5E9F0',
				300: '#ECEFF4'
			},
			frost: {
				100: '#8FBCBB',
				200: '#88C0D0',
				300: '#81A1C1',
				400: '#5E81AC'
			},
			aurora: {
				100: '#BF616A',
				200: '#D08770',
				300: '#EBCB8B',
				400: '#A3BE8C',
				500: '#B48EAD'
			}
		}
	},
	plugins: []
};
