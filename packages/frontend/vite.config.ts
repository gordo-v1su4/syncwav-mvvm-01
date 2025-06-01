import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: [
			'svelte-lucide',
			// Add other packages that need to be bundled for SSR here
		]
	},
	optimizeDeps: {
		include: [
			'svelte-lucide'
		]
	},
	resolve: {
		conditions: ['svelte']
	},
	build: {
		commonjsOptions: {
			include: [/svelte-lucide/]
		}
	}
});
