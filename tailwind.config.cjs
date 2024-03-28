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
				contessa: {
					DEFAULT: '#BF616A',
					50: '#F4E4E5',
					100: '#EED5D8',
					200: '#E2B8BC',
					300: '#D79BA1',
					400: '#CB7E85',
					500: '#BF616A',
					600: '#A5434C',
					700: '#7D333A',
					800: '#552327',
					900: '#2D1215',
					950: '#190A0C'
				},
				// charade: {
				// 	DEFAULT: 'var(--charade-800)',
				// 	50: 'var(--charade-50)',
				// 	100: 'var(--charade-100)',
				// 	200: 'var(--charade-200)',
				// 	300: 'var(--charade-300)',
				// 	400: 'var(--charade-400)',
				// 	500: 'var(--charade-500)',
				// 	600: 'var(--charade-600)',
				// 	700: 'var(--charade-700)',
				// 	800: 'var(--charade-800)',
				// 	900: 'var(--charade-900)'
				// }
				'swamp-green': {
					DEFAULT: 'var(--swamp-green-500)',
					50: 'var(--swamp-green-50)',
					100: 'var(--swamp-green-100)',
					200: 'var(--swamp-green-200)',
					300: 'var(--swamp-green-300)',
					400: 'var(--swamp-green-400)',
					500: 'var(--swamp-green-500)',
					600: 'var(--swamp-green-600)',
					700: 'var(--swamp-green-700)',
					800: 'var(--swamp-green-800)',
					900: 'var(--swamp-green-900)'
				},
				putty: {
					DEFAULT: 'var(--putty-500)',
					50: 'var(--putty-50)',
					100: 'var(--putty-100)',
					200: 'var(--putty-200)',
					300: 'var(--putty-300)',
					400: 'var(--putty-400)',
					500: 'var(--putty-500)',
					600: 'var(--putty-600)',
					700: 'var(--putty-700)',
					800: 'var(--putty-800)',
					900: 'var(--putty-900)'
				},
				charade: {
					DEFAULT: '#434C5E',
					50: '#E6E8ED',
					100: '#DADEE5',
					200: '#C2C8D4',
					300: '#AAB2C3',
					400: '#939DB2',
					500: '#7B87A1',
					600: '#65738E',
					700: '#545F76',
					800: '#434C5E',
					900: '#323946',
					950: '#2A2F3A'
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
