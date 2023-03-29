import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useErc20Contract } from 'hooks/ERC20/Erc20Contract'
import { useApproveERC20Tx } from 'hooks/ERC20/transactor/ApproveTx'
import { useContext, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'

export function ApproveMigrationCallout({
  approveAmount,
  legacyTokenContractAddress,
  version,
  onDone,
}: {
  approveAmount: BigNumber
  legacyTokenContractAddress: string | undefined
  version: '1' | '2'
  onDone: VoidFunction
}) {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const [loading, setLoading] = useState<boolean>(false)

  // const approveTokensTx = useApproveTokensTx()
  const approveErc20Tx = useApproveERC20Tx()
  const legacyTokenContract = useErc20Contract(legacyTokenContractAddress)

  const approveTokens = async () => {
    if (!approveAmount || !tokenAddress || !legacyTokenContract) return // todo error noti

    setLoading(true)

    const txSuccess = await approveErc20Tx(
      {
        amountWad: approveAmount,
        tokenContract: legacyTokenContract,
        senderAddress: tokenAddress,
      },
      {
        onConfirmed() {
          setLoading(false)
          onDone?.()
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
    }
  }

  return (
    <Callout.Info>
      <p>
        <Trans>
          Approve migration for your {fromWad(approveAmount)} v{version} legacy
          tokens.
        </Trans>
      </p>
      <Button loading={loading} onClick={() => approveTokens()} type="primary">
        <span>
          <Trans>Approve</Trans>
        </span>
      </Button>
    </Callout.Info>
  )
}
