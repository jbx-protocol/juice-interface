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

1. Create a `.env` file in the root directory which mirrors the `.example.env` file. Learn how to define each field in the `.env` file in [Setup](#setup).

## Setup

`juicebox-interface` relies on a number of services for development. Create an account for each of the following services:

- [Infura](https://infura.io)
- [Piñata](https://pinata.cloud)
- [Blocknative](https://www.blocknative.com)

The following sections describe how to set up each service for local development.

### Infura

Juicebox uses [Infura](https://infura.io) to connect to an Ethereum network (mainnet, or one of the testnets).

Take the following steps to create an Infura project for local development:

1. Select **Create New Project** to begin creating a new Infura project.
1. Select the **Ethereum** option from the **Product** dropdown.
1. Enter a **Name** (for example, `juicebox-local`).
1. Select **Create** to create the project.

Next, copy the following fields into your `.env` file:

- **Project ID**. In the `.env` file, copy the **Project ID** into the `NEXT_PUBLIC_INFURA_ID` variable.
- **Endpoint**. This is the Ethereum network that will be used for testing. If you don't know which endpoint to use, select **mainnet**. In the `.env` file, copy the network name (e.g. 'mainnet', not the url) into the `NEXT_PUBLIC_INFURA_NETWORK` variable.

### Piñata

Juicebox uses [Piñata](https://pinata.cloud) to store project metadata. Juicebox projects set a name, description, logo, and other details when creating the project. These details are saved on IPFS as a JSON file using Piñata, and the CID gets stored on-chain with the Juicebox project.

Take the following steps to set up Piñata for local development:

1. Create a Piñata API key ([learn more](https://docs.pinata.cloud/#your-api-keys)).
   - Enable the **Admin** toggle in the **Admin** field.
1. Copy the following fields into your `.env` file:
   - **API Key**. In the `.env` file, copy the **API Key** into the `PINATA_PINNER_KEY` variable.
   - **API Secret**. In the `.env` file, copy the **API Secret** into the `PINATA_PINNER_SECRET` variable.

Note: Once you pass Piñata's free tier of 1GB of storage, you'll need to get access to the premium `PINATA_PINNER_KEY` and `PINATA_PINNER_SECRET` keys. Contact the Peel team in discord to get access. Piñata will constantly give a 429 error if the free tier of API requests has been reached.

### Blocknative

Juicebox uses [Blocknative](https://www.blocknative.com) to onboard users by enabling wallet selection, connection, wallet checks, and real-time state updates.

Take the following steps to set up Blocknative for local development:

1. Create a Blocknative API key ([learn more](https://docs.blocknative.com/webhook-api#setup-api-key)).
1. Copy the API key into the `NEXT_PUBLIC_BLOCKNATIVE_API_KEY` variable of the `.env` file.

### The Graph

Juicebox uses [The Graph](https://thegraph.com) to query the Ethereum network using a GraphQL API.

Take the following steps to set up Juicebox's subgraph for local development:

1. Join [Peel's discord server](https://discord.gg/akpxJZ5HKR).
2. Go to [the dev channel](https://discord.com/channels/939317843059679252/939705688563810304) and inquire about mainnet and rinkeby subgraph URLs.
3. Copy the URL into the `NEXT_PUBLIC_SUBGRAPH_URL` variable of the `.env` file.

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
