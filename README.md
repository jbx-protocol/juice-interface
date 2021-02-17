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

Contracts are located in `packages/hardhat/contracts`. Each time contracts are deployed, artifacts are copied to `packages/app/src/contracts` where they're used by the frontend. 

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
REACT_APP_INFURA_NETWORK=
```

`REACT_APP_INFURA_ID`: Your [Infura](https://infura.io/) key.

`REACT_APP_INFURA_NETWORK`: [Infura network](https://infura.io/docs/ethereum#section/Choose-a-Network). Optional, defaults to 'mainnet'.

---

## 🔏 Web3 Providers:

The frontend has three different providers that provide different levels of access to different chains:

`mainnetProvider`: (read only) [Infura](https://infura.io/) connection to main [Ethereum](https://ethereum.org/developers/) network (and contracts already deployed like [DAI](https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f#code) or [Uniswap](https://etherscan.io/address/0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667)).

`localProvider`: local [HardHat](https://hardhat.org) accounts, used to read from _your_ contracts (`.env` file points you at testnet or mainnet)

`injectedProvider`: your personal [MetaMask](https://metamask.io/download.html), [WalletConnect](https://walletconnect.org/apps) via [Argent](https://www.argent.xyz/), or other injected wallet (generates [burner-provider](https://www.npmjs.com/package/burner-provider) on page load)

---

## Deploying frontend

Deployment is managed via a CI workflow defined in `.github/workflows/main.yaml`, which runs for all commits to the `main` branch and depends on github secrets `GCP_PROD_SA_KEY` and `INFURA_ID`.

The react app is packaged and published to the (juice.work/web-production Google Cloud App Engine)[https://console.cloud.google.com/appengine?project=web-production-294102&serviceId=default]. Once new versions have been published, they must be manually promoted in App Engine before they become live.# juicehouse

# juicehouse
