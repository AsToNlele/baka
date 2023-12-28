import { nextui } from '@nextui-org/react';
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', 'ui-sans-serif', 'system-ui']
			},
			colors: {
				'primarytw': '#F7DF77',
				'secondarytw': '#469174'
			}
		}
	},
	darkMode: 'class',
	plugins: [nextui({
		themes: {
			"landing-theme": {
				extend: "light", // <- inherit default values from dark theme
				colors: {
					// primary: {
					// 	50: "#3B096C",
					// 	100: "#520F83",
					// 	200: "#7318A2",
					// 	300: "#9823C2",
					// 	400: "#c031e2",
					// 	500: "#DD62ED",
					// 	600: "#F182F6",
					// 	700: "#FCADF9",
					// 	800: "#FDD5F9",
					// 	900: "#FEECFE",
					// 	DEFAULT: "#469174",
					// 	foreground: "#ffffff",
					// },
					primary: {
						// DEFAULT: '#469174'
						// DEFAULT: '#FCA17D',
						DEFAULT: '#45BA97'
					},
					secondary: {
						// DEFAULT:'#F7DF77'
						// DEFAULT: '#A97BAA'
						// DEFAULT: '#104547',
						DEFAULT: '#5E105C'
					},
				},
			},
			"main-theme": {
				extend: "light", // <- inherit default values from dark theme
				colors: {
					// primary: {
					// 	50: "#3B096C",
					// 	100: "#520F83",
					// 	200: "#7318A2",
					// 	300: "#9823C2",
					// 	400: "#c031e2",
					// 	500: "#DD62ED",
					// 	600: "#F182F6",
					// 	700: "#FCADF9",
					// 	800: "#FDD5F9",
					// 	900: "#FEECFE",
					// 	DEFAULT: "#469174",
					// 	foreground: "#ffffff",
					// },
					primary: {
						// DEFAULT: '#469174'
						// DEFAULT: '#FCA17D',
						DEFAULT: '#45BA97'
					},
					secondary: {
						// DEFAULT:'#F7DF77'
						// DEFAULT: '#A97BAA'
						// DEFAULT: '#104547',
						DEFAULT: '#6E2594'
					},
				},
			},
		}
	})],
};
