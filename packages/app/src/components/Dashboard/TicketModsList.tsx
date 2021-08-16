import { Button, Modal } from 'antd'
import ProjectTicketMods from 'components/shared/formItems/ProjectTicketMods'
import Mod from 'components/shared/Mod'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber, constants } from 'ethers'
import { FundingCycle } from 'models/funding-cycle'
import { TicketMod } from 'models/mods'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { fromPermyriad } from 'utils/formatNumber'

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
  const { owner } = useContext(ProjectContext)

  const { editableMods, lockedMods } = useMemo(() => {
    const now = new Date().valueOf() / 1000

    return {
      editableMods:
        mods?.filter(m => !m.lockedUntil || m.lockedUntil < now) ?? [],
      lockedMods: mods?.filter(m => m.lockedUntil && m.lockedUntil > now) ?? [],
    }
  }, [mods])

  useLayoutEffect(() => setEditingMods(editableMods), [editableMods])

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

  const modsTotal = mods?.reduce((acc, curr) => acc + curr.percent, 0)
  const ownerPercent = 10000 - (modsTotal ?? 0)

  return (
    <div>
      {mods?.length
        ? mods.map(mod => (
            <div
              key={mod.beneficiary ?? '' + mod.percent}
              style={{ marginBottom: 5 }}
            >
              <Mod mod={mod} value={fromPermyriad(mod.percent) + '%'} />
            </div>
          ))
        : null}

      {ownerPercent > 0 && (
        <Mod
          mod={{ beneficiary: owner, percent: ownerPercent }}
          value={
            <span style={{ fontWeight: 400 }}>
              {fromPermyriad(ownerPercent)}%
            </span>
          }
        />
      )}

      {fundingCycle && projectId?.gt(0) && isOwner ? (
        <div style={{ marginTop: 10 }}>
          <Button size="small" onClick={() => setModalVisible(true)}>
            Edit token receivers
          </Button>
        </div>
      ) : null}

      {fundingCycle ? (
        <Modal
          visible={modalVisible}
          title="Edit reserved token receivers"
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
