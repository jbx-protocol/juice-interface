export const subgraphUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://api.studio.thegraph.com/query/2231/juicebox/0.3.0'
    : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_API_KEY}/subgraphs/id/0x63a2368f4b509438ca90186cb1c15156713d5834-0`
