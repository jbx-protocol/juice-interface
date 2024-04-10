export {}
import { NetworkName } from 'models/networkName'
type Networks = keyof typeof NetworkName

type PublicBaseURLS =
  | 'http://localhost:3000'
  | 'https://juicebox.money'
  | 'https://goerli.juicebox.money'
  | 'https://sepolia.juicebox.money'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_ACCESS_TOKEN: string

      PRE_RENDER_INFURA_ID: Networks
      NEXT_PUBLIC_INFURA_ID: string
      NEXT_PUBLIC_INFURA_NETWORK: Networks

      // Ask in Discord for the goerli subgraph url
      // for both SCHEMA and SUBGRAPH_URL
      NEXT_PUBLIC_SUBGRAPH_URL: string
      SUBGRAPH_URL: string

      NEXT_PUBLIC_BASE_URL: PublicBaseURLS

      NEXT_PUBLIC_TENDERLY_API_KEY: string
      NEXT_PUBLIC_TENDERLY_PROJECT_NAME: string
      NEXT_PUBLIC_TENDERLY_ACCOUNT: string

      NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID: string
      NEXT_PUBLIC_INFURA_IPFS_API_SECRET: string
      NEXT_PUBLIC_INFURA_IPFS_HOSTNAME: string

      NEXT_PUBLIC_SUPABASE_URL: string
      SUPABASE_SERVICE_ROLE_KEY: string
      SUPABASE_JWT_SECRET: string

      POSTMARK_SERVER_TOKEN: string
      JUICEBOX_GUILD_ID: string
    }
  }
}
