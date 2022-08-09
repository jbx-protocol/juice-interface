import { PlusCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { Split } from 'models/v2/splits'
import React, { useCallback, useContext, useMemo, useState } from 'react'

import { getTotalSplitsPercentage } from 'utils/v2/distributions'

import { useSetProjectSplits } from 'hooks/v2/transactor/SetProjectSplits'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/v2/splits'
import { V2EditPayouts } from '../../V2EditPayouts'

export const EditPayoutsModal = ({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
}) => {
  const { fundingCycle } = useContext(V2ProjectContext)
  const [modalLoading, setModalLoading] = useState(false)
  const [editingSplits, setEditingSplits] = useState<Split[]>([])
  const totalSplitsPercentage = useMemo(
    () => getTotalSplitsPercentage(editingSplits),
    [editingSplits],
  )
  const totalSplitsPercentageInvalid = totalSplitsPercentage > 100
  const setProjectSplits = useSetProjectSplits({
    domain: fundingCycle?.configuration?.toString(),
  })

  const onSplitsConfirmed = useCallback(
    async (splits: Split[]) => {
      if (totalSplitsPercentageInvalid) return
      setModalLoading(true)
      const tx = await setProjectSplits(
        {
          groupedSplits: {
            group: ETH_PAYOUT_SPLIT_GROUP,
            splits,
          },
        },
        {
          onConfirmed: () => {
            setModalLoading(false)
            onOk()
          },
          onError: () => setModalLoading(false),
        },
      )
      if (!tx) {
        setModalLoading(false)
      }
    },
    [onOk, setProjectSplits, totalSplitsPercentageInvalid],
  )

  return (
    <Modal
      visible={visible}
      confirmLoading={modalLoading}
      title={<Trans>Edit payouts</Trans>}
      okText={
        <span>
          <Trans>Save payouts</Trans>
        </span>
      }
      cancelText={modalLoading ? t`Close` : t`Cancel`}
      onOk={() => onSplitsConfirmed(editingSplits)}
      onCancel={onCancel}
      width={720}
      destroyOnClose
    >
      <V2EditPayouts
        visible={visible}
        editingSplits={editingSplits}
        setEditingSplits={setEditingSplits}
      />
    </Modal>
  )
}
