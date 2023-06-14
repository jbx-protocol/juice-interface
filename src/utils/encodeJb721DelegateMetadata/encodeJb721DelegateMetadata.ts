import {
  JB721_DELEGATE_V3,
  JB721_DELEGATE_V3_1,
  JB721_DELEGATE_V3_2,
  JB721_DELEGATE_V3_3,
} from 'constants/delegateVersions'
import {
  IJB721Delegate_V3_INTERFACE_ID,
  IJBTiered721Delegate_V3_2_INTERFACE_ID,
} from 'constants/nftRewards'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { constants, utils } from 'ethers'
import { JB721DelegateVersion } from 'models/nftRewards'

export interface JB721DELAGATE_V3_PAY_METADATA {
  tierIdsToMint: number[]
  dontMint?: boolean
  expectMintFromExtraFunds?: boolean
  dontOverspend?: boolean
}

export interface JB721DELAGATE_V3_1_PAY_METADATA {
  tierIdsToMint: number[]
  allowOverspending?: boolean
}

export type JB721DELAGATE_V3_2_PAY_METADATA = JB721DELAGATE_V3_1_PAY_METADATA

export type PayMetadata =
  | JB721DELAGATE_V3_PAY_METADATA
  | JB721DELAGATE_V3_1_PAY_METADATA
  | JB721DELAGATE_V3_2_PAY_METADATA // in future, maybe more

export function encodeJb721DelegateMetadata(
  metadata: PayMetadata,
  version: JB721DelegateVersion | undefined,
) {
  if (!version) return undefined
  switch (version) {
    case JB721_DELEGATE_V3:
      return encodeJB721DelegateV3PayMetadata(
        metadata as JB721DELAGATE_V3_PAY_METADATA,
      )
    case JB721_DELEGATE_V3_1:
      return encodeJB721DelegateV3_1PayMetadata(
        metadata as JB721DELAGATE_V3_1_PAY_METADATA,
      )
    case JB721_DELEGATE_V3_2:
    case JB721_DELEGATE_V3_3:
      return encodeJB721DelegateV3_2PayMetadata(
        metadata as JB721DELAGATE_V3_2_PAY_METADATA,
      )
    default:
      throw new Error(`Invalid delegate version: ${version}`)
  }
}

function encodeJB721DelegateV3PayMetadata(
  metadata: JB721DELAGATE_V3_PAY_METADATA | undefined,
) {
  if (!metadata) return undefined

  const args = [
    constants.HashZero,
    constants.HashZero,
    IJB721Delegate_V3_INTERFACE_ID,
    metadata.dontMint ?? false,
    metadata.expectMintFromExtraFunds ?? false,
    metadata.dontOverspend ?? false,
    metadata.tierIdsToMint,
  ]

  const encoded = utils.defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'bytes4', 'bool', 'bool', 'bool', 'uint16[]'],
    args,
  )

  return encoded
}

function encodeJB721DelegateV3_1PayMetadata(
  metadata: JB721DELAGATE_V3_1_PAY_METADATA | undefined,
) {
  if (!metadata) return undefined

  const args = [
    constants.HashZero,
    constants.HashZero,
    IJB721Delegate_V3_INTERFACE_ID,
    metadata.allowOverspending ?? DEFAULT_ALLOW_OVERSPENDING,
    metadata.tierIdsToMint,
  ]

  const encoded = utils.defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'bytes4', 'bool', 'uint16[]'],
    args,
  )

  return encoded
}

function encodeJB721DelegateV3_2PayMetadata(
  metadata: JB721DELAGATE_V3_2_PAY_METADATA | undefined,
) {
  if (!metadata) return undefined

  const args = [
    constants.HashZero,
    constants.HashZero,
    IJBTiered721Delegate_V3_2_INTERFACE_ID,
    metadata.allowOverspending ?? DEFAULT_ALLOW_OVERSPENDING,
    metadata.tierIdsToMint,
  ]

  const encoded = utils.defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'bytes4', 'bool', 'uint16[]'],
    args,
  )

  return encoded
}
