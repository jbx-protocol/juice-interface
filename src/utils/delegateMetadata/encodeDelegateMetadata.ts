import { IJBBuybackDelegate_INTERFACE_ID } from 'constants/buybackDelegate'
import { IJBTiered721Delegate_V3_4_PAY_ID } from 'constants/nftRewards'
import { BigNumber, BigNumberish, utils } from 'ethers'
import { createMetadata } from 'juicebox-metadata-helper'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import {
  JB721DelegatePayMetadata,
  encodeJb721DelegatePayMetadata,
} from './encodeJb721DelegateMetadata'

/**
 * Encode pay metadata for project delegate contracts.
 *
 * Supports delegate contracts:
 *  - jb721Delegate
 *  - jbBuybackDelegate
 *
 * Note: jbBuybackDelegate metadata uses the Metadata Lib pattern (https://github.com/jbx-protocol/juice-delegate-metadata-lib) and CANNOT be encoded with jb721Delegate contracts older than version 3.4.
 *
 * @param jbBuyBackDelegate.amountToSwap The amount of ETH to use to buy project tokens. "0" will use full pay() amount
 * @param jbBuyBackDelegate.minExpectedTokens Minimum expected received tokens from swap
 * @param jb721Delegate.metadata Metadata for jb721Delegate
 * @param jb721Delegate.version Version of jb721Delegate
 * @returns Encoded metadata string for buyback delegate https://github.com/jbx-protocol/juice-buyback
 */
export function encodeDelegatePayMetadata({
  jbBuybackDelegate,
  jb721Delegate,
}: {
  jbBuybackDelegate?: {
    amountToSwap: BigNumberish
    minExpectedTokens: BigNumberish
  } | null
  jb721Delegate?: {
    metadata: JB721DelegatePayMetadata
    version: JB721DelegateVersion | undefined
  } | null
}) {
  if (
    jb721Delegate?.version &&
    !jb721DelegateVersionSupportsMetadataLib(jb721Delegate.version)
  ) {
    if (jbBuybackDelegate) {
      throw new Error(
        'Metadata encoding for JBBuybackDelegate incompatible with encoding for JB721Delegate',
      )
    }

    // Encode without using metadata lib pattern
    return encodeJb721DelegatePayMetadata(
      jb721Delegate.metadata,
      jb721Delegate.version,
    )
  }

  const delegateIds: string[] = []
  const metadatas: string[] = []

  if (jbBuybackDelegate) {
    delegateIds.push(IJBBuybackDelegate_INTERFACE_ID)
    metadatas.push(
      utils.defaultAbiCoder.encode(
        ['uint256', 'uint256'],
        [
          BigNumber.from(jbBuybackDelegate.amountToSwap).toHexString(),
          BigNumber.from(jbBuybackDelegate.minExpectedTokens).toHexString(),
        ],
      ),
    )
  }

  if (jb721Delegate?.version) {
    const encoded = encodeJb721DelegatePayMetadata(
      jb721Delegate.metadata,
      jb721Delegate.version,
    )

    if (encoded) {
      delegateIds.push(IJBTiered721Delegate_V3_4_PAY_ID)
      metadatas.push(encoded)
    }
  }

  if (!delegateIds.length || !metadatas.length) return

  return createMetadata(delegateIds, metadatas)
}

/**
 * JB721Delegate3_4 supports JB Metadata Lib pattern and should be handled differently
 * @link https://github.com/jbx-protocol/juice-delegate-metadata-lib
 */
function jb721DelegateVersionSupportsMetadataLib(
  version: JB721DelegateVersion | undefined,
): version is JB721DelegateVersion.JB721DELEGATE_V3_4 {
  if (!version) return false

  return version === JB721DelegateVersion.JB721DELEGATE_V3_4
}
