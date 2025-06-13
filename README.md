# Artivus Engine

A browser-based audio-visual creation suite for synchronizing video clips with music, built with SvelteKit and Rust/WebAssembly.

```
project-root/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── server.ts
│   │   ├── uploads/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── components/
│   │   │   │       └── WaveformDisplay.svelte
│   │   │   ├── routes/
│   │   │   │   └── +page.svelte
│   │   │   └── app.html
│   │   ├── static/
│   │   ├── package.json
│   │   └── svelte.config.js
│   └── rust-modules/
├── docs/
├── node_modules/
├── README.md
├── package.json
└── pnpm-workspace.yaml
```

## Project Structure Outline

- **packages/backend/**: Node.js/Express backend server. Handles audio/video uploads, serves files, and API endpoints.
  - `src/index.ts`: Main backend entry point and API logic.
  - `uploads/`: Uploaded user files (audio, video, etc).
- **packages/frontend/**: SvelteKit frontend app. Handles UI, file upload, and waveform display.
  - `src/lib/components/`: Svelte components (e.g., WaveformDisplay for audio visualization).
  - `src/routes/`: SvelteKit routes (e.g., +page.svelte is the main upload/view page).
  - `static/`: Static frontend assets.
- **packages/rust-modules/**: Rust code for WASM modules (if used for audio processing, etc).
- **docs/**: Documentation and design notes.
- **README.md**: Project documentation and usage instructions.
- **pnpm-workspace.yaml**: Monorepo workspace config.


## Monorepo Structure

This project uses a monorepo structure with the following packages:

- **`packages/frontend`** - SvelteKit frontend application
- **`packages/backend`** - Node.js/Express backend service  
- **`packages/rust-modules`** - Rust/WebAssembly modules for audio analysis

## ⚠️ Prerequisite: Rust and wasm-pack Required for WASM Builds

This project requires the Rust toolchain and `wasm-pack` to be installed in order to build the Rust WebAssembly modules.

### Install Rust and wasm-pack

#### On Linux/WSL or macOS
```sh
# Install Rust
curl https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env

# Install wasm-pack
cargo install wasm-pack
```

#### On Windows
- **Recommended:** Use [WSL](https://learn.microsoft.com/en-us/windows/wsl/) and follow the Linux instructions above.
- **Or:** Download and install Rust from [https://rustup.rs](https://rustup.rs) and install wasm-pack using PowerShell:
```powershell
cargo install wasm-pack
```

After installing, verify with:
```sh
rustc --version
wasm-pack --version
```

If Rust and wasm-pack are not installed, the WASM build will fail and placeholder files will be used instead, disabling Rust-powered features in the frontend.

## Development

Install dependencies for all packages:

```bash
pnpm install
```

### Running the Development Environment

Start all services in parallel:
```bash
pnpm run dev
```

Or run individual services:
```bash
# Frontend only (SvelteKit)
pnpm run dev:frontend

# Backend only (Express server)
pnpm run dev:backend
```

### Building

Build all packages:
```bash
pnpm run build
```

Build individual packages:
```bash
# Frontend
pnpm run build:frontend

# Backend  
pnpm run build:backend

# Rust/WASM modules
pnpm run build:rust
```

## Project Architecture

### Frontend (`packages/frontend`)
- **SvelteKit** for the frontend framework
- **Vite** for build tooling and development server
- **TypeScript** for type safety
- Custom CSS with "rust-peaks" dark theme styling
- Web Audio API for audio processing
- WebGL2 for video rendering

### Backend (`packages/backend`)
- **Node.js/Express** for file upload handling
- **TypeScript** with ESM modules
- **Multer** for multipart file uploads
- **CORS** enabled for frontend communication

### Rust Modules (`packages/rust-modules`)
- **Rust** compiled to WebAssembly
- **wasm-pack** for building and packaging
- Audio analysis algorithms (beat detection, stem separation, etc.)
- Real-time audio processing capabilities

## Task Checklist Progress

Following the detailed task checklist in `docs/main-task-list.md`:

### ✅ General Project Setup & Cross-Cutting Concerns
- [x] Monorepo structure with packages/frontend, packages/backend, packages/rust-modules
- [x] Basic Node.js/Express backend setup
- [x] Rust/WASM module foundation
- [ ] Testing setup (Vitest, Jest)
- [ ] ESLint and Prettier configuration

### 🔄 Epic 1: Project Foundation & Core Media Handling
- [x] Story 1.1: Application shell and layout (frontend)
- [ ] Story 1.2: Audio upload with backend integration
- [x] Story 1.3: Waveform display (frontend)
- [ ] Story 1.4: Video upload with backend integration  
- [ ] Story 1.5: Video synchronization with WebGL2

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm run dev`
4. Open frontend: http://localhost:5173
5. Backend API: http://localhost:3001

The application will start in SETUP mode where you can upload audio and video files to begin creating your audio-visual project.
