import preprocess from "svelte-preprocess";
/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
		// hydrate the <div id="svelte"> element in src/app.html
        adapater: require("@sveltejs/adapter-static")(),
		target: '#svelte'
	},

    preprocess: [preprocess({
        "postcss": true
    })]
};

export default config;
