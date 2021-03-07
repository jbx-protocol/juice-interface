import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, DescriptionsProps, Switch } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { useContext, useState } from 'react'
import { formatBigNum } from 'utils/formatBigNum'
import { orEmpty } from 'utils/orEmpty'

type ReserveAmounts = {
  adminFees: BigNumber
  beneficiaryDonations: BigNumber
  issuerTickets: BigNumber
}

export default function Reserves({
  ticketAddress,
  descriptionsStyle,
}: {
  ticketAddress?: string
  descriptionsStyle?: DescriptionsProps
}) {
  const { weth, currentBudget } = useContext(UserContext)
  const [onlyDistributable, setOnlyDistributable] = useState<boolean>(false)

  const emptyReserves: ReserveAmounts = {
    adminFees: BigNumber.from(0),
    beneficiaryDonations: BigNumber.from(0),
    issuerTickets: BigNumber.from(0),
  }

  const reservesUpdateOn: ContractUpdateOn = [
    {
      contract: ContractName.Juicer,
      eventName: 'Pay',
      topics: currentBudget ? [currentBudget.id.toString()] : undefined,
    },
    {
      contract: ContractName.Juicer,
      eventName: 'Redeem',
      topics: currentBudget ? [[], currentBudget.project] : undefined,
    },
  ]

  const distributableReserves = useContractReader<ReserveAmounts>({
    contract: ContractName.Juicer,
    functionName: 'getReserves',
    args: currentBudget ? [currentBudget?.project, true] : null,
    formatter: val => val ?? emptyReserves,
    valueDidChange: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.adminFees.eq(old?.adminFees ?? 0) &&
        val.beneficiaryDonations.eq(old?.beneficiaryDonations ?? 0) &&
        val.issuerTickets.eq(old?.issuerTickets ?? 0)
      )
    },
    updateOn: reservesUpdateOn,
  })

  const reserves = useContractReader<ReserveAmounts>({
    contract: ContractName.Juicer,
    functionName: 'getReserves',
    args: currentBudget ? [currentBudget?.project, false] : null,
    formatter: val => val ?? emptyReserves,
    valueDidChange: (val, old) => {
      if (!val || (!val && !old)) return false
      return (
        val.adminFees.eq(old?.adminFees ?? 0) &&
        val.beneficiaryDonations.eq(old?.beneficiaryDonations ?? 0) &&
        val.issuerTickets.eq(old?.issuerTickets ?? 0)
      )
    },
    updateOn: reservesUpdateOn,
  })

  const ticketContract = useErc20Contract(ticketAddress)

  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })

  const displayReserves = onlyDistributable ? distributableReserves : reserves

  return (
    <Descriptions {...descriptionsStyle} column={1}>
      <Descriptions.Item label="Only distributable">
        <Switch
          defaultChecked={onlyDistributable}
          onChange={value => setOnlyDistributable(value)}
        ></Switch>
      </Descriptions.Item>
      <Descriptions.Item label="Admin reserves">
        {orEmpty(formatBigNum(displayReserves?.adminFees))} {weth?.symbol}
      </Descriptions.Item>
      <Descriptions.Item label="Donation reserves">
        {orEmpty(formatBigNum(displayReserves?.beneficiaryDonations))}{' '}
        {weth?.symbol}
      </Descriptions.Item>
      <Descriptions.Item label="Project owner reserves">
        {orEmpty(formatBigNum(displayReserves?.issuerTickets))} {ticketSymbol}
      </Descriptions.Item>
    </Descriptions>
  )
}
