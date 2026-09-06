# Hey.xyz

Hey is a decentralized and permissionless social media application built with Lens Protocol.

> **Open Source Snapshot Notice**
>
> This repository represents the **last publicly available open-source version of Hey.xyz before May 15, 2026**.
>
> Development and changes made to Hey.xyz **after May 15, 2026 are currently not open source** and are not included in this repository.
>
> This repository is therefore preserved as a historical open-source snapshot of the Hey.xyz codebase as it existed before that date.

---

## About

Hey is a decentralized social network built on top of the Lens Protocol.

The application provides a social experience where users can create profiles, publish content, interact with other users, and participate in a permissionless social network powered by blockchain technology.

This repository contains the source code for the open-source version of Hey that was available before **May 15, 2026**.

### Important

This repository should be considered a **historical snapshot**, rather than the current production source code of Hey.xyz.

The production version of Hey.xyz may contain features, architectural changes, infrastructure changes, security improvements, and other modifications that are not present in this repository.

---

## Open Source Status

| Period              | Source Code Status                  |
| ------------------- | ----------------------------------- |
| Before May 15, 2026 | Open source                         |
| May 15, 2026        | Last open-source development period |
| After May 15, 2026  | Currently not open source           |

The purpose of this repository is to preserve and provide access to the codebase that was publicly available prior to the transition.

**No claim is made that this repository represents the current implementation running on Hey.xyz.**

---

## Tech Stack

This version of Hey is built using modern web and Web3 technologies, including:

* TypeScript
* React
* Next.js
* Tailwind CSS
* GraphQL
* Lens Protocol
* Wagmi
* Viem
* PostgreSQL
* pnpm
* Node.js

The repository is structured as a monorepo and contains the application source code and supporting development tooling.

---

## Requirements

Before running the project locally, make sure you have the following installed:

* [Node.js](https://nodejs.org/) v22 or later
* [pnpm](https://pnpm.io/)
* PostgreSQL
* Git

Using [NVM](https://github.com/nvm-sh/nvm) is recommended for managing Node.js versions.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/slymnoyann/hey.xyz.git
cd hey.xyz
```

If you are using a fork or another copy of this repository, replace the URL accordingly.

### 2. Install Node.js

If the repository contains an `.nvmrc` file, you can use:

```bash
nvm install
nvm use
```

Verify your Node.js version:

```bash
node -v
```

### 3. Install pnpm

If pnpm is not already installed:

```bash
npm install -g pnpm
```

Verify the installation:

```bash
pnpm -v
```

### 4. Install dependencies

From the repository root:

```bash
pnpm install
```

---

## Environment Variables

The application requires environment variables for local development and certain services.

Where `.env.example` files are provided, copy them to `.env` before starting the application.

For example:

```bash
cp .env.example .env
```

Depending on the package or application being used, additional environment configuration may be required.

Typical configuration may include:

* Lens configuration
* Database connection
* Redis configuration
* API authentication
* Wallet/private key configuration
* Storage configuration
* Application configuration

### Security

**Never commit private keys, API secrets, database credentials, or other sensitive values to Git.**

Use local `.env` files for development and properly managed secrets for production environments.

---

## Development

Start the development environment with:

```bash
pnpm dev
```

Once the development server is running, open the local URL displayed in the terminal.

---

## Build

To create a production build:

```bash
pnpm build
```

---

## Type Checking

Run TypeScript type checking with:

```bash
pnpm typecheck
```

---

## Linting and Formatting

Check the codebase for formatting and linting issues:

```bash
pnpm biome:check
```

Automatically fix supported formatting and linting issues:

```bash
pnpm biome:fix
```

---

## Project Structure

The repository follows a monorepo-style structure.

Some of the main directories and files include:

```text
.
├── .github/
├── .husky/
├── .vscode/
├── public/
├── script/
├── src/
├── .gitignore
├── .nvmrc
├── biome.json
├── ecosystem.config.cjs
├── generated.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
├── possible-types.ts
├── tsconfig.json
└── vite.config.mjs
```

The exact structure may vary between historical commits and branches.

---

## Maintenance Scripts

The repository includes several scripts for development and maintenance.

### Clean the repository

```bash
node script/clean.mjs
```

This can be used to clean generated files and installed dependencies.

### Update dependencies

```bash
node script/update-dependencies.mjs
```

### Sort package files

```bash
node script/sort-package-json.mjs
```

---

## Development Notes

This repository contains a historical version of Hey and may require adjustments to run against currently available third-party infrastructure.

In particular, external services and protocols may have changed since this version was published, including:

* Lens Protocol APIs
* GraphQL endpoints
* RPC endpoints
* Third-party APIs
* Database schemas
* Authentication systems
* Storage providers
* Blockchain networks
* Wallet infrastructure

As a result, **a successful local build does not necessarily mean that the application can be deployed to production without modification.**

---

## Contributing

Contributions to this historical snapshot are welcome through forks and pull requests where appropriate.

However, please keep in mind that this repository represents a historical open-source version of Hey and **does not represent the current private development codebase of Hey.xyz**.

---

## Disclaimer

This repository is provided for archival, educational, research, and development purposes.

It represents the open-source Hey.xyz codebase available before **May 15, 2026**.

Features and development introduced after May 15, 2026 are currently not included because the corresponding source code is not publicly available.

The current Hey.xyz application may differ substantially from the code contained in this repository.

---

## License

This project is released under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

See the [`LICENSE`](./LICENSE) file for the complete license text.

---

## Historical Context

Hey was created as a decentralized and permissionless social network built with Lens Protocol.

This repository preserves an important point in the project's development history: the final open-source state of the application before **May 15, 2026**.

If you are studying the architecture, experimenting with Lens-based social applications, or interested in the evolution of decentralized social networks, this repository can serve as a reference implementation for that period.

---

**Hey.xyz**

A historical open-source snapshot of Hey before May 15, 2026. 🌿
