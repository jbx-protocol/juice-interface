import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import Callout from 'components/Callout'
import { FormItems } from 'components/formItems'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { Split } from 'models/v2/splits'
import { useContext, useEffect } from 'react'
import { formatReservedRate } from 'utils/v2/math'
import { toMod, toSplit } from 'utils/v2/splits'

export const EditTokenAllocation = ({
  editingReservedTokensSplits,
  setEditingReservedTokensSplits,
}: {
  editingReservedTokensSplits: Split[]
  setEditingReservedTokensSplits: (splits: Split[]) => void
}) => {
  const { reservedTokensSplits, fundingCycleMetadata } =
    useContext(V2ProjectContext)
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
