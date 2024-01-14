/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				text: ['Source Sans Pro', 'Arial', 'sans-serif'],
				heading: ['Oxygen', 'Helvetica', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
