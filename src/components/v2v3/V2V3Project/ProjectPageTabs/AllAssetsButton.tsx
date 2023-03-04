import { Trans } from '@lingui/macro'
import { TextButton } from 'components/buttons/TextButton'
import { useState } from 'react'
import { V2V3ProjectTokenBalancesModal } from '../modals/V2V3ProjectTokenBalancesModal'

export function AllAssetsButton() {
  const [balancesModalVisible, setBalancesModalVisible] =
    useState<boolean>(false)

  return (
    <>
      <TextButton onClick={() => setBalancesModalVisible(true)}>
        <Trans>All assets</Trans>
      </TextButton>
      <V2V3ProjectTokenBalancesModal
        open={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
      />
    </>
  )
}
