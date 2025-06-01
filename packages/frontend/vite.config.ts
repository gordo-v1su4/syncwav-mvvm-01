import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	// Configure Vite to properly handle WASM files
	plugins: [
		sveltekit(),
		// Custom plugin to ensure proper WASM MIME type
		{
			name: 'configure-wasm',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					if (req.url?.endsWith('.wasm')) {
						res.setHeader('Content-Type', 'application/wasm');
					}
					next();
				});
			}
		}
	],
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
		},
		// Ensure WASM files are properly handled during build
		assetsInlineLimit: 0, // Don't inline WASM files
		assetsDir: 'assets'
	}
});
