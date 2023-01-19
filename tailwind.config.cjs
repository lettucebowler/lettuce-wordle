const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/@lettucebowler/lettuce-ui/**/*.{svelte,ts,js,html}'
	],
	theme: {
		extend: {
			colors: {
				transparent: 'transparent',
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
				},
				charade: {
					DEFAULT: '#2E3440',
					50: '#9CA5B8',
					100: '#939DB1',
					200: '#818DA5',
					300: '#6F7D98',
					400: '#616E87',
					500: '#545F75',
					600: '#485164',
					700: '#3B4252',
					800: '#2E3440',
					900: '#21262E'
				}
			},
			animation: {
				bulge: 'bulge 0.3s linear 1',
				wiggle: 'wiggle 0.15s linear 1',
				flyup: 'flyup 0.5s ease-in 1',
				fadein: 'fadein 0.5s ease-in 1'
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
				},
				flyup: {
					'0%': {
						transform: 'translateY(+100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				fadein: {
					'0%': {
						opacity: '0'
					},
					'50%': {
						opacity: '1'
					}
				}
			}
		}
	},
	plugins: []
};
