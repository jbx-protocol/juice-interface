import { t } from '@lingui/macro'
import { Button, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { getTotalPercentage } from 'components/shared/formItems/formHelpers'
import Mod from 'components/shared/Mod'

import { ProjectContext } from 'contexts/projectContext'
import { BigNumber, constants } from 'ethers'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { useSetPayoutModsTx } from 'hooks/transactor/SetPayoutModsTx'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod } from 'models/mods'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { formatWad, fromPermyriad, fromWad } from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'

import { CURRENCY_ETH } from 'constants/currency'
import ProjectPayoutMods from './formItems/ProjectPayoutMods'

export default function PayoutModsList({
  mods,
  fundingCycle,
  projectId,
  total,
  fee,
}: {
  mods: PayoutMod[] | undefined
  fundingCycle:
    | Pick<FundingCycle, 'target' | 'currency' | 'configured' | 'fee'>
    | undefined
  projectId: BigNumber | undefined
  fee: BigNumber | undefined
  total?: BigNumber
}) {
  const [form] = useForm<{
    totalPercent: number
  }>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingMods, setEditingMods] = useState<PayoutMod[]>()
  const { owner } = useContext(ProjectContext)
  const setPayoutModsTx = useSetPayoutModsTx()

  const { editableMods, lockedMods } = useMemo(() => {
    const now = new Date().valueOf() / 1000

    return {
      editableMods:
        mods?.filter(m => !m.lockedUntil || m.lockedUntil < now) ?? [],
      lockedMods: mods?.filter(m => m.lockedUntil && m.lockedUntil > now) ?? [],
    }
  }, [mods])

  useLayoutEffect(() => setEditingMods(editableMods), [editableMods])

  async function setMods() {
    await form.validateFields()

    if (!fundingCycle || !editingMods) return

    setLoading(true)

    setPayoutModsTx(
      {
        configured: fundingCycle.configured,
        payoutMods: [...lockedMods, ...editingMods],
      },
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

  const baseTotal = total ?? amountSubFee(fundingCycle?.target, fee)

  const hasEditPermission = useHasPermission(OperatorPermission.SetPayoutMods)

  const totalPercentage = getTotalPercentage(editingMods)

  if (!fundingCycle) return null

  return (
    <div>
      {mods?.length
        ? [...mods]
            .sort((a, b) => (a.percent < b.percent ? 1 : -1))
            .map((mod, i) => (
              <div
                key={`${mod.beneficiary ?? mod.percent}-${i}`}
                style={{ marginBottom: 5 }}
              >
                <Mod
                  mod={mod}
                  value={
                    <span style={{ fontWeight: 400 }}>
                      {fromPermyriad(mod.percent)}%
                      {!fundingCycle.target.eq(constants.MaxUint256) && (
                        <>
                          {' '}
                          (
                          <CurrencySymbol
                            currency={
                              fundingCycle.currency.toNumber() as CurrencyOption
                            }
                          />
                          {formatWad(baseTotal?.mul(mod.percent).div(10000), {
                            precision: fundingCycle.currency.eq(CURRENCY_ETH)
                              ? 4
                              : 0,
                            padEnd: true,
                          })}
                          )
                        </>
                      )}
                    </span>
                  }
                />
              </div>
            ))
        : null}

      {ownerPercent > 0 && (
        <Mod
          mod={{ beneficiary: owner, percent: ownerPercent }}
          value={
            <div style={{ fontWeight: 400 }}>
              {fromPermyriad(ownerPercent)}%
              {!fundingCycle.target.eq(constants.MaxUint256) && (
                <>
                  {' '}
                  (
                  <CurrencySymbol
                    currency={
                      fundingCycle.currency.toNumber() as CurrencyOption
                    }
                  />
                  {formatWad(baseTotal?.mul(ownerPercent).div(10000), {
                    precision: fundingCycle.currency.eq(CURRENCY_ETH) ? 4 : 0,
                    padEnd: true,
                  })}
                  )
                </>
              )}
            </div>
          }
        />
      )}

      {fundingCycle && projectId?.gt(0) && hasEditPermission ? (
        <div style={{ marginTop: 10 }}>
          <Button size="small" onClick={() => setModalVisible(true)}>
            Edit payouts
          </Button>
        </div>
      ) : null}

      {fundingCycle ? (
        <Form
          form={form}
          layout="vertical"
          onKeyDown={e => {
            if (e.key === 'Enter') setMods()
          }}
        >
          <Modal
            visible={modalVisible}
            title="Edit payouts"
            okText="Save payouts"
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
                Payouts are optional. By default, all unallocated revenue will
                be withdrawable to the project owner's wallet.
              </p>
            </div>

            <Form.Item
              name="payouts"
              rules={[
                {
                  validator: () => {
                    if (totalPercentage > 100)
                      return Promise.reject(
                        t`Sum of percentages cannot exceed 100%`,
                      )

                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                hidden
                type="string"
                autoComplete="off"
                value={totalPercentage}
              />
            </Form.Item>

            <ProjectPayoutMods
              mods={editingMods}
              lockedMods={lockedMods}
              onModsChanged={setEditingMods}
              target={fromWad(fundingCycle.target)}
              currency={fundingCycle.currency.toNumber() as CurrencyOption}
              fee={fee}
            />
          </Modal>
        </Form>
      ) : null}
    </div>
  )
}
