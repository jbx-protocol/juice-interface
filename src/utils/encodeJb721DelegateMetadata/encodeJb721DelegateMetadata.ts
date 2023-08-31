import {
  IJB721Delegate_V3_2_INTERFACE_ID,
  IJB721Delegate_V3_INTERFACE_ID,
  IJBTiered721Delegate_V3_2_INTERFACE_ID,
  IJBTiered721Delegate_V3_4_PAY_ID,
  IJBTiered721Delegate_V3_4_REDEEM_ID,
} from 'constants/nftRewards'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { constants, utils } from 'ethers'
import { createMetadata } from 'juicebox-metadata-helper'
import { JB721DelegateVersion } from 'models/v2v3/contracts'

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
    case JB721DelegateVersion.JB721DELEGATE_V3:
      return encodeJB721DelegateV3PayMetadata(
        metadata as JB721DELAGATE_V3_PAY_METADATA,
      )
    case JB721DelegateVersion.JB721DELEGATE_V3_1:
      return encodeJB721DelegateV3_1PayMetadata(
        metadata as JB721DELAGATE_V3_1_PAY_METADATA,
      )
    case JB721DelegateVersion.JB721DELEGATE_V3_2:
    case JB721DelegateVersion.JB721DELEGATE_V3_3:
      return encodeJB721DelegateV3_2PayMetadata(
        metadata as JB721DELAGATE_V3_2_PAY_METADATA,
      )
    case JB721DelegateVersion.JB721DELEGATE_V3_4:
      return encodeJB721DelegateV3_4PayMetadata(
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

function encodeJB721DelegateV3_4PayMetadata(
  metadata: JB721DELAGATE_V3_2_PAY_METADATA | undefined,
) {
  if (!metadata) return undefined

  const args = [
    metadata.allowOverspending ?? DEFAULT_ALLOW_OVERSPENDING,
    metadata.tierIdsToMint,
  ]

  const encoded = utils.defaultAbiCoder.encode(['bool', 'uint16[]'], args)
  const result = createMetadata([IJBTiered721Delegate_V3_4_PAY_ID], [encoded])

  return result
}

export function encodeJB721DelegateV3RedeemMetadata(
  tokenIdsToRedeem: string[],
) {
  const args = [
    constants.HashZero,
    IJB721Delegate_V3_INTERFACE_ID,
    tokenIdsToRedeem,
  ]

  const encoded = utils.defaultAbiCoder.encode(
    ['bytes32', 'bytes4', 'uint256[]'],
    args,
  )

  return encoded
}

export function encodeJB721DelegateV3_2RedeemMetadata(
  tokenIdsToRedeem: string[],
) {
  const args = [
    constants.HashZero,
    IJB721Delegate_V3_2_INTERFACE_ID,
    tokenIdsToRedeem,
  ]

  const encoded = utils.defaultAbiCoder.encode(
    ['bytes32', 'bytes4', 'uint256[]'],
    args,
  )

  return encoded
}

export function encodeJB721DelegateV3_4RedeemMetadata(
  tokenIdsToRedeem: string[],
) {
  const args = [tokenIdsToRedeem]
  const encoded = utils.defaultAbiCoder.encode(['uint256[]'], args)
  const result = createMetadata(
    [IJBTiered721Delegate_V3_4_REDEEM_ID],
    [encoded],
  )

  return result
}
