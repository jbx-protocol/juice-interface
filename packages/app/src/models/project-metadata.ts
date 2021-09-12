import { TokenRef } from './token-ref'

type ProjectMetadataVersion = undefined | 1

export type ProjectMetadata = Partial<{
  name: string
  description: string
  logoUri: string
  infoUri: string
  payText: string
  version: ProjectMetadataVersion
  tokens: TokenRef[]
}>
