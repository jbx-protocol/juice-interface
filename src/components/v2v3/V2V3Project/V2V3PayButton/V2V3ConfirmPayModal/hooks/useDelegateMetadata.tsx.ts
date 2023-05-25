import {
  JB721DELAGATE_V3_1_PAY_METADATA,
  JB721DELAGATE_V3_2_PAY_METADATA,
  JB721DELAGATE_V3_PAY_METADATA,
} from 'components/Project/PayProjectForm/hooks/usePayProjectForm'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import {
  JB721_DELEGATE_V3,
  JB721_DELEGATE_V3_1,
  JB721_DELEGATE_V3_2,
} from 'constants/delegateVersions'
import {
  IJB721Delegate_V3_INTERFACE_ID,
  IJBTiered721Delegate_V3_2_INTERFACE_ID,
} from 'constants/nftRewards'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { constants, utils } from 'ethers'
import { useContext } from 'react'

export function encodeJB721DelegateV3PayMetadata(
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

export function encodeJB721DelegateV3_1PayMetadata(
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

export function encodeJB721DelegateV3_2PayMetadata(
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

export function useDelegateMetadata() {
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )

  const { form: payProjectForm } = useContext(PayProjectFormContext)

  return JB721DelegateVersion === JB721_DELEGATE_V3
    ? encodeJB721DelegateV3PayMetadata({
        ...(payProjectForm?.payMetadata as JB721DELAGATE_V3_PAY_METADATA),
      })
    : JB721DelegateVersion === JB721_DELEGATE_V3_1
    ? encodeJB721DelegateV3_1PayMetadata({
        ...(payProjectForm?.payMetadata as JB721DELAGATE_V3_1_PAY_METADATA),
        allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
      })
    : JB721DelegateVersion === JB721_DELEGATE_V3_2
    ? encodeJB721DelegateV3_2PayMetadata({
        ...(payProjectForm?.payMetadata as JB721DELAGATE_V3_2_PAY_METADATA),
        allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
      })
    : undefined
}
