import { Button, Modal } from 'antd'
import ProjectMods from 'components/shared/formItems/ProjectMods'
import * as moment from 'moment'
import ProjectHandle from 'components/shared/ProjectHandle'
import ShortAddress from 'components/shared/ShortAddress'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber, constants } from 'ethers'
import { ModRef } from 'models/mods'
import { useContext, useLayoutEffect, useState } from 'react'
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

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useLayoutEffect(() => setEditingMods(mods), [])

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
        editingMods.map(m => ({
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
          setEditingMods(undefined)
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
                  locked until {formatDate(m.lockedUntil * 1000, 'MM-DD-yyyy')}
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

      {editingMods && fundingCycle ? (
        <Modal
          visible={modalVisible}
          title="Edit auto payouts"
          onOk={() => setMods()}
          onCancel={() => {
            setEditingMods(undefined)
            setModalVisible(false)
          }}
          confirmLoading={loading}
          width={720}
          destroyOnClose
        >
          <ProjectMods
            name="mods"
            target={parseFloat(fromWad(fundingCycle.target))}
            mods={editingMods}
            currency={fundingCycle.currency.toNumber() as CurrencyOption}
            onModsChanged={setEditingMods}
          />
        </Modal>
      ) : null}
    </div>
  )
}
