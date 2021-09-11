const config = {
	darkMode: "media",
	mode: "jit",
	purge: [
		"./src/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {
			colors: {
				"primary-blue": "#93E3FE",
				"secondary-blue": "AFEAFF",
				"primary-black": "#111111",
				"primary-red": "#E41556",
				"primary-white": "#F2F2F2"
			}
		},
	},
	plugins: [
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/aspect-ratio"),
	],
};

module.exports = config;
