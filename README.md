# 🧃⚡️ juice.work

[juice.work](https://juice.work)

Built with [🏗 scaffold-eth](https://github.com/austintgriffith/scaffold-eth)

---

## Run local

Serve the app locally and use with a local blockchain.

In `packages/app`, Create `.env` from `.example.env`, add required `REACT_APP_INFURA_ID`.

```bash
yarn install
```

> start 👷[Hardhat](https://hardhat.org/) local blockchain:

```bash
yarn chain
```

> in a second terminal window, deploy contract to local blockchain:

```bash
yarn deploy
```

> in a third terminal window, start the app and open http://localhost:3000 to view it

```bash
yarn start
```

🔑 Create wallets links to your app with `yarn wallet` (empty) or `yarn fundedwallet` (pre-loaded with ETH)

🔧 Configure 👷[HardHat](https://hardhat.org/config/) by editing `hardhat.config.js` in `packages/hardhat`

> ✨ The [HardHat network](https://hardhat.org/hardhat-network/) provides _stack traces_ and _console.log_ debugging for our contracts ✨

Run `yarn account` to create a local deployer wallet private key. To send ETH to generated wallet on a local chain, run  `# yarn send --from <address or account index> --to <receiver address> --amount <ETH amount>`

---

## Deploying contracts

Contracts are located in `packages/hardhat/contracts`. 

Each time contracts are deployed, artifacts are copied to:
- `packages/app/src/contracts` where they're used by the frontend
- `packages/subgraph/abis` where they're used to generate Graph templates

The frontend connects to whichever chain its provider (i.e. Metamask) is using to, and reads the corresponding contract artifacts for that chain. Connecting to a chain that Juice contracts have not been deployed to will cause the app to fail.

### deploy to local chain

```bash
yarn deploy
```

### deploy to ropsten

```bash
yarn deploy-ropsten
```

### deploy to mainnet

```bash
yarn deploy-mainnet
```

---

## Frontend .env

Create new `packages/app/.env`, reference `packages/app/.example.env`

```bash
REACT_APP_INFURA_ID=
```

`REACT_APP_INFURA_ID`: Your [Infura](https://infura.io/) key.

---

## 🔏 Web3 Providers:

The frontend has three different providers that provide different levels of access to different chains:

`readProvider`: used to read from contracts on network of injected provider (`.env` file points you at testnet or mainnet)

`signingProvider`: your personal [MetaMask](https://metamask.io/download.html), [WalletConnect](https://walletconnect.org/apps) via [Argent](https://www.argent.xyz/), or other injected wallet (generates [burner-provider](https://www.npmjs.com/package/burner-provider) on page load). Used to sign transactions.

---

## Deploying frontend

`yarn ipfs` to build and deploy frontend to IPFS.

## Graph

Juice uses the Graph to query contract events from the frontend. Event handlers and mappings are defined in packages/subgraph/src. ***Production deployment is still WIP.***

### Running locally
Install Docker.

1. Make sure local chain is running.
2. In a new terminal window: `yarn graph-run-node` to start Docker Graph node. 
- Node is ready when terminal output reads:
> `INFO Starting GraphQL WebSocket server at: ws://localhost:8001, component: SubscriptionServer`
3. In another terminal window: `yarn graph-create-local` to create subgraph and add to local node. (Only needs to be run once per local graph node. `yarn graph-remove-local` to remove the subgraph.)
4. `yarn graph-ship-local` while the node is running to ship changes to subgraph template, mappings, and schema defined in packages/subgraph/src.

## Theme

The app uses the `SemanticTheme` pattern defined in src/models/semantic-theme, which allows mapping style properties to any number of enumerated `ThemeOption`s. These properties are defined in src/constants/theme. Theme styles can be accessed via `ThemeContext` defined in src/contexts/themeContext and instantiated in src/hooks/JuiceTheme, or via CSS root variables.

The app also relies on (antd)[https://ant-design.gitee.io/] components. To make Antd compatible with `SemanticTheme`, overrides are defined in src/styles/antd-overrides.

# juicehouse
