import { NftPostPayModalConfig } from './nftRewardTier'
import { TokenRef } from './token-ref'

type ProjectMetadata =
  | ProjectMetadataV1
  | ProjectMetadataV2
  | ProjectMetadataV3
  | ProjectMetadataV4
  | ProjectMetadataV5

type ProjectMetadataV1 = Partial<{
  name: string
  description: string
  logoUri: string
  infoUri: string
  payText: string
  version: 1
}>

// add `tokens`
type ProjectMetadataV2 = Partial<
  Omit<ProjectMetadataV1, 'version'> & {
    version: 2
    tokens: TokenRef[]
  }
>

// `payText` -> `payButton`
type ProjectMetadataV3 = Partial<
  Omit<ProjectMetadataV2, 'version' | 'payText'> & {
    version: 3
    twitter: string
    discord: string
    payButton: string
    payDisclosure: string
  }
>

// add `archived`
export type ProjectMetadataV4 = Partial<
  Omit<ProjectMetadataV3, 'version'> & {
    version: 4
    archived: boolean
  }
>

// add `nftPaymentSuccessModal`
export type ProjectMetadataV5 = Partial<
  Omit<ProjectMetadataV4, 'version'> & {
    version: 5
    nftPaymentSuccessModal: NftPostPayModalConfig
  }
>

// Converts metadata of any version to latest version
export const consolidateMetadata = (
  metadata: ProjectMetadata,
): ProjectMetadataV5 => {
  return {
    ...metadata,
    payButton:
      (metadata as ProjectMetadataV3).payButton ??
      (metadata as ProjectMetadataV2).payText,
    version: 5,
    nftPaymentSuccessModal:
      (metadata as ProjectMetadataV5)?.nftPaymentSuccessModal ?? undefined,
  }
}
