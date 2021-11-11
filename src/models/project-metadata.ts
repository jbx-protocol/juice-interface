import { TokenRef } from './token-ref'

export type ProjectMetadata =
  | ProjectMetadataV1
  | ProjectMetadataV2
  | ProjectMetadataV3

export type ProjectMetadataV1 = Partial<{
  name: string
  description: string
  logoUri: string
  infoUri: string
  payText: string
  version: 1
}>

export type ProjectMetadataV2 = Partial<
  Omit<ProjectMetadataV1, 'version'> & {
    version: 2
    tokens: TokenRef[]
  }
>

export type ProjectMetadataV3 = Partial<
  Omit<ProjectMetadataV2, 'version' | 'payText'> & {
    version: 3
    twitter: string
    discord: string
    payButton: string
    payDisclosure: string
  }
>

// Converts metadata of any version to latest version
export const consolidateMetadata = (
  metadata: ProjectMetadata,
): ProjectMetadataV3 => {
  return {
    ...metadata,
    payButton:
      (metadata as ProjectMetadataV3).payButton ??
      (metadata as ProjectMetadataV2).payText,
    version: 3,
  }
}
