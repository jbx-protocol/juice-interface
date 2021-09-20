// TODO: support local dev.
export const subgraphUrl =
  process.env.REACT_APP_INFURA_NETWORK === `rinkeby`
    ? `https://api.studio.thegraph.com/query/9534/juicebox-rinkeby/v0.0.1`
    : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_API_KEY}/subgraphs/id/0x63a2368f4b509438ca90186cb1c15156713d5834-0`
