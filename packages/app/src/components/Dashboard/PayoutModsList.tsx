import { LockOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import ProjectHandle from 'components/shared/ProjectHandle'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber, constants } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
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

  const adminFeePercent = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'fee',
  })

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
      <TooltipLabel
        label={<h4 style={{ display: 'inline-block' }}>Spending</h4>}
        tip="Available funds are distributed according to any payouts below. The rest will go to the project owner."
      />
      {mods?.length ? (
        mods.map((m, i) => (
          <div
            key={`${m.beneficiary ?? m.percent}-${i}`}
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
                  <div style={{ fontWeight: 500 }}>
                    @<ProjectHandle projectId={m.projectId} />:
                  </div>
                  <div
                    style={{
                      fontSize: '.8rem',
                      color: colors.text.secondary,
                      marginLeft: 10,
                    }}
                  >
                    <TooltipLabel
                      label={'Beneficiary:'}
                      tip={`This address will receive any tokens minted when the recipient project gets paid.`}
                    />
                    &nbsp;
                    <FormattedAddress address={m.beneficiary} />
                  </div>
                </div>
              ) : (
                <div style={{ fontWeight: 500 }}>
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
              {fromPermyriad(m.percent)}%
              {!fundingCycle.target.eq(constants.MaxUint256) && (
                <>
                  {' '}
                  (
                  <CurrencySymbol
                    currency={
                      fundingCycle.currency.toNumber() as CurrencyOption
                    }
                  />
                  {formatWad(
                    fundingCycle.target
                      .mul(m.percent ?? 0)
                      .div(10000)
                      .mul(BigNumber.from(200).sub(adminFeePercent ?? 0))
                      .div(200),
                  )}
                  )
                </>
              )}
            </span>
          </div>
        ))
      ) : (
        <div style={{ color: colors.text.secondary }}>
          100% to project owner
        </div>
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
          <div>
            <p>
              Payouts let you commit portions of every withdrawal to other
              Ethereum wallets or Juicebox projects. Use this to pay
              contributors, charities, other projects you depend on, or anyone
              else. Payouts will be distributed automatically whenever a
              withdrawal is made from your project.
            </p>
            <p>
              Payouts are optional. By default, all unallocated revenue will be
              withdrawable to the project owner's wallet.
            </p>
          </div>
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
