import { t } from '@lingui/macro'
import { Modal } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useSetProjectSplits } from 'hooks/v2/transactor/SetProjectSplits'
import { Split } from 'models/v2/splits'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { preciseFormatSplitPercent } from 'utils/v2/math'

import { RESERVED_TOKEN_SPLIT_GROUP } from 'constants/v2/splits'
import { V2EditReservedTokens } from '../../V2EditReservedTokens'

export const EditTokenAllocationModal = ({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
}) => {
  const { reservedTokensSplits, fundingCycle } = useContext(V2ProjectContext)

  const setProjectSplits = useSetProjectSplits({
    domain: fundingCycle?.configuration?.toString(),
  })

  const [editingReservedTokensSplits, setEditingReservedTokensSplits] =
    useState<Split[]>([])
  const [modalLoading, setModalLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!reservedTokensSplits) return
    setEditingReservedTokensSplits(reservedTokensSplits)
  }, [reservedTokensSplits])

  const totalPercentage = useMemo(
    () =>
      editingReservedTokensSplits
        ?.map(s => preciseFormatSplitPercent(s.percent))
        .reduce((a, b) => a + b, 0) ?? 0,
    [editingReservedTokensSplits],
  )

  const totalPercentagesInvalid = totalPercentage > 100

  const onSaveTokenAllocation = useCallback(async () => {
    if (totalPercentagesInvalid) return
    setModalLoading(true)
    const tx = await setProjectSplits(
      {
        groupedSplits: {
          group: RESERVED_TOKEN_SPLIT_GROUP,
          splits: editingReservedTokensSplits ?? [],
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
      emitErrorNotification('Token allocation edit failed')
      setModalLoading(false)
    }
  }, [
    editingReservedTokensSplits,
    onOk,
    setProjectSplits,
    totalPercentagesInvalid,
  ])

  return (
    <Modal
      visible={visible}
      confirmLoading={modalLoading}
      title={t`Edit reserved token allocation`}
      okText={t`Save token allocation`}
      cancelText={modalLoading ? t`Close` : t`Cancel`}
      width={720}
      onOk={() => onSaveTokenAllocation()}
      onCancel={onCancel}
      okButtonProps={{ disabled: totalPercentagesInvalid }}
    >
      <V2EditReservedTokens
        editingReservedTokensSplits={editingReservedTokensSplits}
        setEditingReservedTokensSplits={setEditingReservedTokensSplits}
      />
    </Modal>
  )
}
