import { BigNumber } from 'ethers'
import { CSSProperties, useEffect, useState } from 'react'

import useContractReader from '../../hooks/ContractReader'
import { ContractName } from '../../models/contract-name'
import { FundingCycle } from '../../models/funding-cycle'
import { deepEqFundingCycles } from '../../utils/deepEqFundingCycles'

export function FCNumber({
  fundingCycleID,
  style,
}: {
  fundingCycleID: BigNumber | undefined
  style?: CSSProperties
}) {
  const fundingCycle = useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'get',
    args: fundingCycleID ? [fundingCycleID] : null,
    valueDidChange: (a, b) => !deepEqFundingCycles(a, b),
  })

  return fundingCycle ? (
    <span style={style}>{fundingCycle.number.toString()}</span>
  ) : null
}
