import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import Callout from 'components/Callout'
import { FormItems } from 'components/formItems'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { Split } from 'models/splits'
import { useContext, useEffect } from 'react'
import { toMod, toSplit } from 'utils/splits'
import { formatReservedRate } from 'utils/v2v3/math'

export function V2V3EditReservedTokens({
  editingReservedTokensSplits,
  setEditingReservedTokensSplits,
}: {
  editingReservedTokensSplits: Split[]
  setEditingReservedTokensSplits: (splits: Split[]) => void
}) {
  const { reservedTokensSplits, fundingCycleMetadata } =
    useContext(V2V3ProjectContext)
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
