import {
  VeNftTokenJson,
  parseVeNftTokenJson,
  VeNftToken,
} from 'models/subgraph-entities/v2/venft-token'

export interface VeNftContract {
  address: string
  symbol: string
  uriResolver: string
  project: string
  projectId: number
  tokens: Partial<VeNftToken>[]
}

export type VeNftContractJson = Partial<
  Record<Exclude<keyof VeNftContract, 'tokens'>, string> & {
    tokens: VeNftTokenJson[]
  }
>

export const parseVeNftContractJson = (
  j: VeNftContractJson,
): Partial<VeNftContract> => ({
  address: j.address,
  symbol: j.symbol,
  uriResolver: j.uriResolver,
  project: j.project ? j.project : '',
  projectId: j.projectId ? parseInt(j.projectId) : undefined,
  tokens: j.tokens?.map(parseVeNftTokenJson) ?? undefined,
})
