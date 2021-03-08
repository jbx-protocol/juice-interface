import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'
import { Button } from 'antd'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

export default function Gimme() {
  const { userAddress, contracts, transactor, weth } = useContext(UserContext)

  const [gimmeAmount, setGimmeAmount] = useState<string>('2')
  const [allowanceAmount, setAllowanceAmount] = useState<string>('10000')

  const balance = useContractReader<BigNumber>({
    contract: weth?.contract,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
  })

  const allowance = useContractReader<BigNumber>({
    contract: weth?.contract,
    functionName: 'allowance',
    args:
      userAddress && contracts?.Juicer
        ? [userAddress, contracts?.Juicer?.address]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  function gimme() {
    if (!transactor || !contracts?.Token) return

    transactor(contracts.Token, 'gimme', [
      parseEther(gimmeAmount).toHexString(),
    ])
  }

  function approve() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    transactor(contracts.Token, 'approve', [
      contracts.Juicer?.address,
      parseEther(allowanceAmount).toHexString(),
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
        <h4>
          Current {weth?.symbol} allowance: {formatEther(allowance ?? 0)}
        </h4>
        <input
          defaultValue={allowanceAmount}
          placeholder="0"
          onChange={e => setAllowanceAmount(e.target.value)}
        />
        <Button onClick={approve}>Update</Button>
      </div>
      <div>
        <h2>
          Current {weth?.symbol} balance {formatEther(balance ?? 0)}
        </h2>
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
