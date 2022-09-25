const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@lettucebowler/lettuce-ui/**/*.{svelte,ts,js,html}'
	],
	theme: {
		colors: {
			transparent: 'transparent',
			polar: {
				100: '#2E3440',
				200: '#3B4252',
				300: '#434C5E',
				400: '#4C566A'
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
		},
		extend: {
			animation: {
				bulge: 'bulge 0.3s linear 1',
				wiggle: 'wiggle 0.15s linear 1'
			},
			keyframes: {
				bulge: {
					'50%': { transform: 'scale(1.05) translateY(-5%)' },
					'0%, 100%': { transform: 'scale(1)' }
				},
				wiggle: {
					'0%, 100%': { transform: 'translateX(0%)' },
					'25%': { transform: 'translateX(-10%)' },
					'75%': { transform: 'translateX(10%)' }
				}
			}
		}
	},
	plugins: []
};
