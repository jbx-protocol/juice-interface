import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout'
import { useApproveTokensTx } from 'hooks/JBV3Token/transactor/ApproveTokensTx'
import { useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'

export function ApproveMigrationCallout({
  legacyTokenBalance,
  onDone,
}: {
  legacyTokenBalance: BigNumber
  onDone: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>(false)

  const approveTokensTx = useApproveTokensTx()

  const approveTokens = async () => {
    if (!legacyTokenBalance) return // todo error noti

    setLoading(true)

    const txSuccess = await approveTokensTx(
      { amountWad: legacyTokenBalance },
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
          Approve migration for your {fromWad(legacyTokenBalance)} legacy
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
