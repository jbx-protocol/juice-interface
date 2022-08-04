import { useAccount } from 'wagmi'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { formatBytes32String } from '@ethersproject/strings'
import {
  V1FundingCycleMetadata,
  V1FundingCycleProperties,
} from 'models/v1/fundingCycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import { hasFundingTarget } from 'utils/v1/fundingCycle'

import { TransactorInstance } from '../../Transactor'

export function useDeployProjectTx(): TransactorInstance<{
  handle: string
  projectMetadataCid: string
  properties: V1FundingCycleProperties
  fundingCycleMetadata: Omit<V1FundingCycleMetadata, 'version'>
  payoutMods: PayoutMod[]
  ticketMods: TicketMod[]
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { address: userAddress } = useAccount()

  return (
    {
      handle,
      projectMetadataCid,
      properties,
      fundingCycleMetadata,
      payoutMods,
      ticketMods,
    },
    txOpts,
  ) => {
    if (!transactor || !userAddress || !contracts?.TerminalV1_1) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const _properties: Record<keyof V1FundingCycleProperties, string | number> =
      {
        target: properties.target.toHexString(),
        currency: hasFundingTarget({ target: properties.target })
          ? properties.currency.toNumber()
          : 0,
        duration: properties.duration.toNumber(),
        discountRate: properties.duration.gt(0)
          ? properties.discountRate.toNumber()
          : 0,
        cycleLimit: properties.cycleLimit.toNumber(),
        ballot: properties.ballot,
      }

    return transactor(
      contracts.TerminalV1_1,
      'deploy',
      [
        userAddress,
        formatBytes32String(handle),
        projectMetadataCid,
        _properties,
        fundingCycleMetadata,
        payoutMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          projectId: m.projectId || BigNumber.from(0).toHexString(),
          allocator: constants.AddressZero,
        })),
        ticketMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          allocator: constants.AddressZero,
        })),
      ],
      txOpts,
    )
  }
}
