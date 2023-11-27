import { NftPostPayModalConfig } from './nftRewards'
import { ProjectTagName, filterValidTags } from './project-tags'
import { TokenRef } from './tokenRef'

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
type ProjectMetadataV4 = Partial<
  Omit<ProjectMetadataV3, 'version'> & {
    version: 4
    archived: boolean
  }
>

// add `nftPaymentSuccessModal`
type ProjectMetadataV5 = Partial<
  Omit<ProjectMetadataV4, 'version'> & {
    version: 5
    nftPaymentSuccessModal: NftPostPayModalConfig
  }
>

// add `telegram`
type ProjectMetadataV6 = Partial<
  Omit<ProjectMetadataV5, 'version'> & {
    version: 6
    telegram: string
  }
>

// add `coverImageUri`
type ProjectMetadataV7 = Partial<
  Omit<ProjectMetadataV6, 'version'> & {
    version: 7
    coverImageUri: string
  }
>

// add `tags`
type ProjectMetadataV8 = Partial<
  Omit<ProjectMetadataV7, 'version'> & {
    version: 8
    tags: ProjectTagName[]
  }
>

type ProjectMetadataV9 = Partial<
  Omit<ProjectMetadataV8, 'version'> & {
    version: 9
    projectTagline: string
  }
>

type ProjectMetadataV10 = Partial<
  Omit<ProjectMetadataV9, 'version'> & {
    version: 10
    introVideoUrl: string
    introImageUri: string
    softTargetAmount: string
    softTargetCurrency: string
    domain: string
    projectRequiredOFACCheck: boolean
  }
>

export type AnyProjectMetadata =
  | ProjectMetadataV1
  | ProjectMetadataV2
  | ProjectMetadataV3
  | ProjectMetadataV4
  | ProjectMetadataV5
  | ProjectMetadataV6
  | ProjectMetadataV7
  | ProjectMetadataV8
  | ProjectMetadataV9
  | ProjectMetadataV10

// Current version
export type ProjectMetadata = ProjectMetadataV10
export const LATEST_METADATA_VERSION = 10

// Converts metadata of any version to latest version
export const consolidateMetadata = (
  metadata: AnyProjectMetadata,
): ProjectMetadata => {
  return {
    ...metadata,
    tags: filterValidTags((metadata as ProjectMetadataV8).tags),
    payButton:
      (metadata as ProjectMetadataV3).payButton ??
      (metadata as ProjectMetadataV2).payText,
    version: LATEST_METADATA_VERSION,
  }
}
