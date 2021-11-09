import { TokenRef } from './token-ref'

export type ProjectMetadata = ProjectMetadataV1 | ProjectMetadataV2

export type ProjectMetadataV1 = Partial<{
  name: string
  description: string
  logoUri: string
  infoUri: string
  payText: string
  version: 1
}>

export type ProjectMetadataV2 = Partial<{
  name: string
  description: string
  logoUri: string
  infoUri: string
  payText: string
  version: 2
  tokens: TokenRef[]
}>
