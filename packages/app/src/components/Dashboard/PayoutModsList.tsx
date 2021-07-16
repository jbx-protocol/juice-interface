import { LockOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import ProjectHandle from 'components/shared/ProjectHandle'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber, constants } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod } from 'models/mods'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad, fromPermyriad, fromWad } from 'utils/formatNumber'

import ProjectPayoutMods from '../shared/formItems/ProjectPayoutMods'

export default function PayoutModsList({
  mods,
  fundingCycle,
  projectId,
  isOwner,
}: {
  mods: PayoutMod[] | undefined
  fundingCycle: FundingCycle | undefined
  projectId: BigNumber | undefined
  isOwner: boolean | undefined
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingMods, setEditingMods] = useState<PayoutMod[]>()
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
      'setPayoutMods',
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

  if (!fundingCycle) return null

  return (
    <div>
      {mods?.length ? (
        mods.map(m => (
          <div
            key={m.beneficiary ?? '' + m.percent}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 5,
            }}
          >
            <span style={{ lineHeight: 1.4 }}>
              {m.projectId && BigNumber.from(m.projectId).gt(0) ? (
                <div>
                  <div style={{ fontWeight: 600 }}>
                    @<ProjectHandle projectId={m.projectId} />:
                  </div>
                  <div
                    style={{ fontSize: '.8rem', color: colors.text.secondary }}
                  >
                    Beneficiary: <FormattedAddress address={m.beneficiary} />
                  </div>
                </div>
              ) : (
                <div style={{ fontWeight: 600 }}>
                  <FormattedAddress address={m.beneficiary} />:
                </div>
              )}
              {m.lockedUntil ? (
                <div
                  style={{ fontSize: '.8rem', color: colors.text.secondary }}
                >
                  <LockOutlined /> until{' '}
                  {formatDate(m.lockedUntil * 1000, 'MM-DD-yyyy')}
                </div>
              ) : null}{' '}
            </span>
            <span style={{ fontWeight: 400 }}>
              {fromPermyriad(m.percent)}% (
              <CurrencySymbol
                currency={fundingCycle.currency.toNumber() as CurrencyOption}
              />
              {formatWad(
                fundingCycle.target
                  .mul(m.percent ?? 0)
                  .div(1000)
                  .div(100),
              )}
              )
            </span>
          </div>
        ))
      ) : (
        <span style={{ color: colors.text.secondary }}>No payouts set</span>
      )}

      {fundingCycle && projectId?.gt(0) && isOwner ? (
        <div style={{ marginTop: 10 }}>
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
          <ProjectPayoutMods
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
