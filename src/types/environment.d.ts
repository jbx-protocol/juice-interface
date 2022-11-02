export {}
import { NetworkName } from 'models/network-name'
type Networks = keyof typeof NetworkName

export type PinataGatewayHostnameURLS =
  | 'gateway.pinata.cloud'
  | 'jbx-goerli.mypinata.cloud'
  | 'jbx-mainnet.mypinata.cloud'

export type PublicBaseURLS =
  | 'http://localhost:3000'
  | 'https://juicebox.money'
  | 'https://goerli.juicebox.money'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_INFURA_ID: string
      PRE_RENDER_INFURA_ID: Networks
      NEXT_PUBLIC_INFURA_NETWORK: Networks
      // Ask in Discord for the goerli subgraph url
      // for both SCHEMA and SUBGRAPH_URL
      NEXT_PUBLIC_SUBGRAPH_URL: string
      GRAPHQL_SCHEMA_SUBGRAPH_URL: string
      NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME: PinataGatewayHostnameURLS
      NEXT_PUBLIC_BASE_URL: PublicBaseURLS
      NEXT_PUBLIC_SENTRY_DSN: string
      PINATA_PINNER_KEY: string
      PINATA_PINNER_SECRET: string
      GITHUB_ACCESS_TOKEN: string
      NEXT_PUBLIC_ARCX_API_KEY: string
    }
  }
}
