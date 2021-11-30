import { BigNumber } from '@ethersproject/bignumber'
import { UserContext } from 'contexts/userContext'
import { useContractLoader } from 'hooks/ContractLoader'
import { useGasPrice } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'
import { ChildElems } from 'models/child-elems'
import { useEffect, useState } from 'react'

export default function User({ children }: { children: ChildElems }) {
  const [adminFeePercent, setAdminFeePercent] = useState<BigNumber>()
  const contracts = useContractLoader()

  const gasPrice = useGasPrice('average')

  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  useEffect(() => {
    async function fetchData() {
      const res = await contracts?.TerminalV1.functions.fee()
      setAdminFeePercent(res[0])
    }
    fetchData()
  }, [contracts])

  return (
    <UserContext.Provider
      value={{
        contracts,
        transactor,
        adminFeePercent,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
