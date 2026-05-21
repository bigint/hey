# Hey

## Requirements

To start working with Hey, make sure the following tools are installed:

- [Node.js](https://nodejs.org/en/download/) (v22 or higher) - the JavaScript runtime used in this project.
- [pnpm](https://pnpm.io/installation) - the package manager used by this repository.

## Installation

### Clone the Repository

```bash
git clone git@github.com:bigint/hey.git
cd hey
```

### Install NVM and pnpm

On macOS, you can install both with Homebrew:

```bash
brew install nvm pnpm
```

### Install Node.js

Use `nvm` to install the required Node.js version:

```bash
nvm install
```

### Install Dependencies

From the repository root, install dependencies with pnpm:

```bash
pnpm install
```

### Start the Development Server

To run the Vite application in development mode:

```bash
pnpm dev
```

## Build

### Build the application

Compile the application:

```bash
pnpm build
```

### Type-check the project

Validate the codebase with the TypeScript type checker:

```bash
pnpm typecheck
```

### Lint and Format Code

Check code quality and formatting with Biome:

```bash
pnpm biome:check
```

Automatically fix linting and formatting issues:

```bash
pnpm biome:fix
```

### Maintenance Scripts

Convenient Node.js helpers are in the `script` directory:

- `node script/clean.mjs` removes all `node_modules`, `.next` directories,
  `pnpm-lock.yaml`, and `tsconfig.tsbuildinfo` files.
- `node script/update-dependencies.mjs` updates packages across the repository,
  removes old installs and commits the changes in a new branch.
- `node script/sort-package-json.mjs` sorts all `package.json` files in the
  repository.

## License

This project is released under the **GNU AGPL-3.0** license. See the [LICENSE](./LICENSE) file for details

🌸
