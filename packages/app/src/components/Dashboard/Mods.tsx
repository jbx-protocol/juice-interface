import { Button, Modal } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import ProjectMods from 'components/shared/formItems/ProjectMods'
import ProjectHandle from 'components/shared/ProjectHandle'
import ShortAddress from 'components/shared/ShortAddress'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber, constants } from 'ethers'
import { ModRef } from 'models/mods'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { fromPerbicent, fromWad } from 'utils/formatNumber'

import { FundingCycle } from '../../models/funding-cycle'
import { CurrencyOption } from 'models/currency-option'
import { UserContext } from 'contexts/userContext'
import { formatDate } from 'utils/formatDate'

export default function Mods({
  mods,
  fundingCycle,
  projectId,
  isOwner,
}: {
  mods: ModRef[] | undefined
  fundingCycle: FundingCycle | undefined
  projectId: BigNumber | undefined
  isOwner: boolean | undefined
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingMods, setEditingMods] = useState<ModRef[]>()
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
            <span style={{ minWidth: 70 }}>{fromPerbicent(m.percent)}%:</span>
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
        <span style={{ color: colors.text.secondary }}>
          No payouts configured
        </span>
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
          title="Edit auto payouts"
          onOk={() => setMods()}
          onCancel={() => {
            setEditingMods(mods)
            setModalVisible(false)
          }}
          confirmLoading={loading}
          width={720}
        >
          <ProjectMods
            target={parseFloat(fromWad(fundingCycle.target))}
            mods={editingMods}
            lockedMods={lockedMods}
            currency={fundingCycle.currency.toNumber() as CurrencyOption}
            onModsChanged={setEditingMods}
          />
        </Modal>
      ) : null}
    </div>
  )
}
