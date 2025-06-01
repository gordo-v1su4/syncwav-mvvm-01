# Artivus Engine

A browser-based audio-visual creation suite for synchronizing video clips with music, built with SvelteKit and Rust/WebAssembly.

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Project Structure

This project uses:
- **SvelteKit** for the frontend framework
- **Vite** for build tooling and development server
- **pnpm** for package management
- **TypeScript** for type safety
- Custom CSS with "rust-peaks" dark theme styling
- Rust/WebAssembly modules for performance-critical audio processing
