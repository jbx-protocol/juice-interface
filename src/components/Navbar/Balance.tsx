import EthPrice from 'components/Navbar/EthPrice'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import {} from 'react'

import ETHAmount from 'components/currency/ETHAmount'

export default function Balance({
  address,
  showEthPrice,
  hideTooltip,
}: {
  address: string | undefined
  showEthPrice?: boolean
  hideTooltip?: boolean
}) {
  const { data: balance } = useEthBalanceQuery(address)

  return (
    <div className="align-middle leading-none text-grey-400 dark:text-slate-200">
      <ETHAmount amount={balance} fallback="--" hideTooltip={hideTooltip} />

      {showEthPrice && (
        <div className="text-grey-400 dark:text-slate-200">
          <EthPrice />
        </div>
      )}
    </div>
  )
}
