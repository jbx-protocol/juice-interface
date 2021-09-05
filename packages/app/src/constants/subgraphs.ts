const deploymentID = 'Qma55qUEASRbpSAGupaKSd9XZxz6Fk9hNjFoTRY3XSV8fF'

export const subgraphUrl =
  true
    ? 'https://api.studio.thegraph.com/query/2231/juicebox/0.3.0'
    : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_API_KEY}/deployments/id/${deploymentID}`
