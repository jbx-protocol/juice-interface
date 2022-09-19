import { BigNumber } from '@ethersproject/bignumber'
import { TransactionContext } from 'contexts/transactionContext'
import { useGasPriceQuery } from 'hooks/GasPrice'
import { useTransactor } from 'hooks/Transactor'

export const TransactionProvider: React.FC = ({ children }) => {
  const { data: gasPrice } = useGasPriceQuery('average')
  const transactor = useTransactor({
    gasPrice: gasPrice ? BigNumber.from(gasPrice) : undefined,
  })

  return (
    <TransactionContext.Provider
      value={{
        transactor,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
