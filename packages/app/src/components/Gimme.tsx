import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useWeth } from 'hooks/Weth'
import { useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

export default function Gimme() {
  const { userAddress, contracts, transactor } = useContext(UserContext)

  const [gimmeAmount, setGimmeAmount] = useState<number>(10000)
  const [allowanceAmount, setAllowanceAmount] = useState<number>(10000)

  const weth = useWeth()

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
      BigNumber.from(gimmeAmount).toHexString(),
    ])
  }

  function approve() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    transactor(contracts.Token, 'approve', [
      contracts.Juicer?.address,
      BigNumber.from(allowanceAmount).toHexString(),
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
        <h4>Current allowance: {allowance?.toNumber() ?? 0}</h4>
        <input
          defaultValue={allowanceAmount}
          placeholder="0"
          onChange={e => setAllowanceAmount(parseFloat(e.target.value))}
        />
        <Button onClick={approve}>Update</Button>
      </div>
      <div>
        <h2>Current token balance {balance?.toNumber()}</h2>
        <h4>Get Token</h4>
        <input
          defaultValue={gimmeAmount}
          placeholder="0"
          onChange={e => setGimmeAmount(parseFloat(e.target.value))}
        />
        <Button onClick={gimme}>Gimme</Button>
      </div>
    </div>
  )
}
