const deploymentID = 'Qma55qUEASRbpSAGupaKSd9XZxz6Fk9hNjFoTRY3XSV8fF'

// TODO: support local dev.
export const subgraphUrl =
  process.env.REACT_APP_INFURA_NETWORK === `rinkeby`
    ? `https://api.studio.thegraph.com/query/9534/juicebox-rinkeby/v0.0.1`
    : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_API_KEY}/deployments/id/${deploymentID}`
