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
					100: 'var(--snow-100)',
					200: 'var(--snow-200)',
					300: 'var(--snow-300)'
				},
				frost: {
					100: 'var(--frost-100)',
					200: 'var(--frost-200)',
					300: 'var(--frost-300)',
					400: 'var(--frost-400)'
				},
				aurora: {
					100: 'var(--aurora-100)',
					200: 'var(--aurora-200)',
					300: 'var(--aurora-300)',
					400: 'var(--aurora-400)',
					500: 'var(--aurora-500)'
				},
				charade: {
					DEFAULT: 'var(--charade-800)',
					50: 'var(--charade-50)',
					100: 'var(--charade-100)',
					200: 'var(--charade-200)',
					300: 'var(--charade-300)',
					400: 'var(--charade-400)',
					500: 'var(--charade-500)',
					600: 'var(--charade-600)',
					700: 'var(--charade-700)',
					800: 'var(--charade-800)',
					900: 'var(--charade-900)'
				}
			},
			animation: {
				jump: 'jump 0.3s ease-in-out 1',
				wiggle: 'wiggle 0.15s ease-in infinite',
				'wiggle-once': 'wiggle 0.15s ease-in 1',
				flyup: 'flyup 0.5s ease-in 1',
				fadein: 'fadein 0.5s ease-in 1'
			},
			keyframes: {
				jump: {
					'50%': { transform: 'scale(1.05) translateY(-7%)' },
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
	plugins: [require('tailwind-scrollbar')]
};
