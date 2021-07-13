import { LockOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import ProjectHandle from 'components/shared/ProjectHandle'
import ShortAddress from 'components/shared/ShortAddress'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber, constants } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { PaymentMod } from 'models/mods'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { formatDate } from 'utils/formatDate'
import { fromPermyriad, fromWad } from 'utils/formatNumber'

import ProjectPaymentMods from '../shared/formItems/ProjectPaymentMods'

export default function PaymentModsList({
  mods,
  fundingCycle,
  projectId,
  isOwner,
}: {
  mods: PaymentMod[] | undefined
  fundingCycle: FundingCycle | undefined
  projectId: BigNumber | undefined
  isOwner: boolean | undefined
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingMods, setEditingMods] = useState<PaymentMod[]>()
  const { transactor, contracts } = useContext(UserContext)

  const { editableMods, lockedMods } = useMemo(() => {
    const now = new Date().valueOf() / 1000

    return {
      editableMods:
        mods?.filter(m => !m.lockedUntil || m.lockedUntil < now) ?? [],
      lockedMods: mods?.filter(m => m.lockedUntil && m.lockedUntil > now) ?? [],
    }
  }, [mods])

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useLayoutEffect(() => setEditingMods(editableMods), [])

  function setMods() {
    if (
      !transactor ||
      !contracts ||
      !projectId ||
      !fundingCycle ||
      !editingMods
    )
      return

    setLoading(true)

    transactor(
      contracts.ModStore,
      'setPaymentMods',
      [
        projectId.toHexString(),
        fundingCycle.configured.toHexString(),
        [...lockedMods, ...editingMods].map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          projectId: m.projectId || BigNumber.from(0).toHexString(),
          allocator: constants.AddressZero,
        })),
      ],
      {
        onDone: () => setLoading(false),
        onConfirmed: () => {
          setModalVisible(false)
          setEditingMods(editableMods)
        },
      },
    )
  }

  return (
    <div>
      {mods?.length ? (
        mods.map(m => (
          <div
            key={m.beneficiary}
            style={{
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span style={{ minWidth: 70 }}>{fromPermyriad(m.percent)}%:</span>
            <span style={{ fontWeight: 500, fontSize: '0.75rem' }}>
              {m.projectId && BigNumber.from(m.projectId).gt(0) ? (
                <span>
                  <div>
                    @<ProjectHandle projectId={m.projectId} /> (Beneficiary:{' '}
                    <ShortAddress address={m.beneficiary} />)
                  </div>
                </span>
              ) : (
                <ShortAddress address={m.beneficiary} />
              )}
              {m.lockedUntil ? (
                <div>
                  <LockOutlined /> locked until{' '}
                  {formatDate(m.lockedUntil * 1000, 'MM-DD-yyyy')}
                </div>
              ) : null}
            </span>
          </div>
        ))
      ) : (
        <span style={{ color: colors.text.secondary }}>No payouts set</span>
      )}

      {fundingCycle && projectId?.gt(0) && isOwner ? (
        <div style={{ marginTop: 5 }}>
          <Button size="small" onClick={() => setModalVisible(true)}>
            Edit payouts
          </Button>
        </div>
      ) : null}

      {fundingCycle ? (
        <Modal
          visible={modalVisible}
          title="Edit payouts"
          onOk={() => setMods()}
          onCancel={() => {
            setEditingMods(mods)
            setModalVisible(false)
          }}
          confirmLoading={loading}
          width={720}
        >
          <ProjectPaymentMods
            mods={editingMods}
            lockedMods={lockedMods}
            onModsChanged={setEditingMods}
            target={fromWad(fundingCycle.target)}
            currency={fundingCycle.currency.toNumber() as CurrencyOption}
          />
        </Modal>
      ) : null}
    </div>
  )
}
