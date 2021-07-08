import { LockOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import ProjectTicketMods from 'components/shared/formItems/ProjectTicketMods'
import ShortAddress from 'components/shared/ShortAddress'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber, constants } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { TicketMod } from 'models/mods'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { formatDate } from 'utils/formatDate'
import { fromPerbicent } from 'utils/formatNumber'

export default function TicketModsList({
  mods,
  fundingCycle,
  projectId,
  isOwner,
}: {
  mods: TicketMod[] | undefined
  fundingCycle: FundingCycle | undefined
  projectId: BigNumber | undefined
  isOwner: boolean | undefined
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingMods, setEditingMods] = useState<TicketMod[]>()
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
      'setTicketMods',
      [
        projectId.toHexString(),
        fundingCycle.configured.toHexString(),
        [...lockedMods, ...editingMods].map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
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
              <ShortAddress address={m.beneficiary} />
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
        <span style={{ color: colors.text.secondary }}>No allocations set</span>
      )}

      {fundingCycle && projectId?.gt(0) && isOwner ? (
        <div style={{ marginTop: 5 }}>
          <Button size="small" onClick={() => setModalVisible(true)}>
            Allocate token reserves
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
          <ProjectTicketMods
            mods={editingMods}
            lockedMods={lockedMods}
            onModsChanged={setEditingMods}
          />
        </Modal>
      ) : null}
    </div>
  )
}
