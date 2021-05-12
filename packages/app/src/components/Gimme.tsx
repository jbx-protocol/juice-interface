import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'
import { Button } from 'antd'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import { useContext, useEffect, useState } from 'react'

export default function Gimme() {
  const { userAddress, contracts, transactor, signingProvider } = useContext(
    UserContext,
  )
  const [balance, setBalance] = useState<BigNumber>()

  const [gimmeAmount, setGimmeAmount] = useState<string>('2')

  useEffect(() => {
    async function getBalance() {
      if (!signingProvider || !userAddress) return
      setBalance(await signingProvider.getBalance(userAddress))
    }

    getBalance()
  }, [userAddress, signingProvider])

  function gimme() {
    if (!transactor || !contracts?.Token) return

    transactor(contracts.Token, 'gimme', [
      parseEther(gimmeAmount).toHexString(),
    ])
  }

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 30,
        padding: padding.app,
      }}
    >
      <div>
        <h2>Current ETH balance {formatEther(balance ?? 0)}</h2>
        <h4>Get Token</h4>
        <input
          defaultValue={gimmeAmount}
          placeholder="0"
          onChange={e => setGimmeAmount(e.target.value)}
        />
        <Button onClick={gimme}>Gimme</Button>
      </div>
    </div>
  )
}
