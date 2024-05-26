# Development

## Quick Links

- [Internationalization](internationalization.md)
- [DevOps](devops.md)
- [Codebase architecture](architecture/)

## Installation

1. Create a [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of this repository.
1. Clone your fork and navigate to the root directory.
1. Install project dependencies.

   ```bash
   yarn install
   ```

1. Install Docker (https://docs.docker.com/get-docker/).
1. Create a `.env` file in the root directory which mirrors the `.example.env` file. Learn how to define each field in the `.env` file in [Setup](#setup).

## Setup

`juicebox-interface` relies on a number of services for development. Create an account for each of the following services:

- [Infura](https://infura.io)

The following sections describe how to set up each service for local development.

### Infura

Juicebox uses [Infura](https://infura.io) to connect to an Ethereum network (mainnet, or one of the testnets).

Take the following steps to create an Infura project for local development:

1. Select **Create New Key** to begin creating a new Infura project.
1. Select the **Web 3 API** option from the **Network** dropdown.
1. Enter a **Name** (for example, `juicebox-local`).
1. Select **Create** to create the project.

Next, copy the following fields into your `.env` file:

- **Project ID**. In the `.env` file, copy the **Project ID** into the `NEXT_PUBLIC_INFURA_ID` variable.
- **Endpoint**. This is the Ethereum network that will be used for testing. If you don't know which endpoint to use, select **mainnet**. In the `.env` file, copy the network name (e.g. 'mainnet', not the url) into the `NEXT_PUBLIC_INFURA_NETWORK` variable.

#### Infura IPFS gateway

1. Select **Create new key** to begin creating a new Infura project.
1. Select **IPFS** from the **NETWORK** dropdown.
1. Enter a **Name** (for example, `juicebox-ipfs-local`).
1. Select **Create** to create the project.

Next, copy the following fields into your `.env` file:

- **PROJECT ID**. In the `.env` file, copy the **Project ID** into the `INFURA_IPFS_PROJECT_ID` variable.
- **API KEY SECRET**. In the `.env` file, copy the **API KEY SECRET** into the `INFURA_IPFS_API_SECRET` variable.
- **DEDICATED GATEWAY SUBDOMAIN**. In the `.env` file, copy the **DEDICATED GATEWAY SUBDOMAIN** into the `NEXT_PUBLIC_INFURA_IPFS_HOSTNAME` variable _without the `https://` prefix_.

### The Graph

Juicebox uses [The Graph](https://thegraph.com) to query the Ethereum network using a GraphQL API.

Take the following steps to set up Juicebox's subgraph for local development:

1. Join [Peel's discord server](https://discord.gg/akpxJZ5HKR).
2. Inquire about mainnet and Sepolia subgraph URLs in the [`#dev` channel](https://discord.com/channels/939317843059679252/939705688563810304).
3. Copy the URL into the `NEXT_PUBLIC_SUBGRAPH_URL` variable of the `.env` file.

### Supabase

Juicebox uses [Supabase](https://supabase.com/) to store metadata about the site.

Take the following steps to setup Juicebox's Subgraph for local development:

1. Ensure that Docker is installed locally (https://docs.docker.com/get-docker/).
1. Run `yarn supabase:start`. This will need to be run every time during development.
1. Once running, some environment variables will be printed to your CLI. Make sure to add them:

```
# This is the endpoint for the supabase service - locally it should be "http://localhost:54321"
NEXT_PUBLIC_SUPABASE_URL=<FROM CLI - API URL>
# This is the anonymous JWT used by non-authorized calls to supabase - generated on start (should persist as the same between runs).
NEXT_PUBLIC_SUPABASE_ANON_KEY=<FROM CLI - anon key>
# This is the main role key. Think of it as a super user key. Is used on the server. This is also generated on start (should persist as the same between runs).
SUPABASE_SERVICE_ROLE_KEY=<FROM CLI - service_role key>
# This is the JWT used for signing session JWTs by the server. This is also generated on start (should persist as the same between runs).
SUPABASE_JWT_SECRET=<FROM_CLI - JWT secret>
```

Locally, you can ignore `SUPABASE_PROJECT_ID`.

During local dev without a cron, the update routine endpoint /api/projects/update must be called anytime a database is restarted, or when changes to projects need to be reflected in the database.

## Usage

1. Run the app in dev mode

   ```bash
   yarn dev
   ```

2. Build a production build

   ```bash
   yarn build
   ```

3. Run a production build locally

   ```bash
   yarn build
   yarn start
   ```

## Transaction simulation

In development, you can simulate transactions using [Tenderly](https://tenderly.co/). Tenderly produces a stacktrace that you can use to debug failing transactions.

Set up Tenderly for your development environment using the following steps:

1. Create a Tenderly account
2. Set the following variables in your `.env` file (**without the comments**):

   ```
   # .env
   NEXT_PUBLIC_TENDERLY_API_KEY= # your user tenderly api key
   NEXT_PUBLIC_TENDERLY_PROJECT_NAME= # your tenderly project
   NEXT_PUBLIC_TENDERLY_ACCOUNT=  # your user account name
   ```

3. Start your development server.

   ```bash
   yarn dev
   ```

Once set up, every transaction that you submit will be simulated using Tenderly.

When a simulation fails, an error is logged to the development console. This log contains a link to the simulation in Tenderly.

> Note: there is a 50 simulation per month limit per account.

# Testing

## Unit tests

Run the jest test suite using the following command:

```bash
yarn test
```

# Debugging and Troubleshooting

## Analyzing bundle size

To analyze the bundle size, run the following command:

```bash
ANALYZE=true yarn build
```

This command will generate a report in the `dist` folder.
