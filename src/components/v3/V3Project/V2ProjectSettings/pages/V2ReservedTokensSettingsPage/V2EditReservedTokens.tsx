import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import Callout from 'components/Callout'
import { FormItems } from 'components/formItems'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { Split } from 'models/splits'
import { useContext, useEffect } from 'react'
import { toMod, toSplit } from 'utils/splits'
import { formatReservedRate } from 'utils/v2/math'

export function V2EditReservedTokens({
  editingReservedTokensSplits,
  setEditingReservedTokensSplits,
}: {
  editingReservedTokensSplits: Split[]
  setEditingReservedTokensSplits: (splits: Split[]) => void
}) {
  const { reservedTokensSplits, fundingCycleMetadata } =
    useContext(V3ProjectContext)
  const reservedRate = fundingCycleMetadata?.reservedRate

  useEffect(() => {
    if (!reservedTokensSplits) return
    setEditingReservedTokensSplits(reservedTokensSplits)
  }, [reservedTokensSplits, setEditingReservedTokensSplits])

  return (
    <>
      <Callout style={{ marginBottom: '1rem' }}>
        <Trans>
          Changes to your reserved token allocation will take effect
          immediately.
        </Trans>
      </Callout>
      <Form layout="vertical">
        <FormItems.ProjectTicketMods
          mods={editingReservedTokensSplits.map(toMod)}
          onModsChanged={mods =>
            setEditingReservedTokensSplits(mods.map(toSplit))
          }
          formItemProps={{
            label: <Trans>Reserved token allocation</Trans>,
            extra: (
              <Trans>
                Allocate a portion of your project's reserved tokens to other
                Ethereum wallets or Juicebox projects.
              </Trans>
            ),
          }}
          reservedRate={parseInt(formatReservedRate(reservedRate))}
        />
      </Form>
    </>
  )
}
