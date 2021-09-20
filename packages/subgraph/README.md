# juice-graph

- Mainnet: https://thegraph.com/explorer/subgraph/decentraland/juicebox
- Rinkeby: https://thegraph.com/explorer/subgraph/decentraland/juicebox-rinkeby

### Install

```bash
yarn install install
```

### Deploy

First you will need to authenticate with the proper deploy key for the given network. Or you can create your own Subgraph and deploy key for testing:

```bash
graph auth  --studio ${your-key}
```

If you are deploying one of the official Juicebox subgraphs (listed above), deploy it using the following:

```bash
yarn prepare:${network} && yarn deploy:${network}
```

If you are deploying your own Subgraph for testing:

```bash
yarn prepare:${network} && graph deploy --node https://api.studio.thegraph.com/deploy/ ${your-project}
```

`yarn prepare:${network}` will generate the proper `subgraph.yaml` file based on the network you are trying to deploy to.
