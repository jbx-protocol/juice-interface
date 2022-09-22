import { t, Trans } from '@lingui/macro'
import { Button, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import CurrencySymbol from 'components/CurrencySymbol'
import { getTotalPercentage } from 'components/formItems/formHelpers'
import Mod from 'components/v1/shared/Mod'

import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { useSetPayoutModsTx } from 'hooks/v1/transactor/SetPayoutModsTx'
import { PayoutMod } from 'models/mods'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { V1OperatorPermission } from 'models/v1/permissions'
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import {
  formatWad,
  fromWad,
  perbicentToPercent,
  permyriadToPercent,
} from 'utils/format/formatNumber'
import { amountSubFee } from 'utils/v1/math'

import { V1CurrencyName } from 'utils/v1/currency'

import { CsvUpload } from 'components/CsvUpload/CsvUpload'
import { V1_CURRENCY_ETH } from 'constants/v1/currency'
import { parseV1PayoutModsCsv } from 'utils/csv'
import { MODS_TOTAL_PERCENT } from 'utils/v1/mods'
import ProjectPayoutMods from './ProjectPayMods/ProjectPayoutMods'

export default function PayoutModsList({
  mods,
  fundingCycle,
  projectId,
  total,
  feePerbicent,
}: {
  mods: PayoutMod[] | undefined
  fundingCycle:
    | Pick<V1FundingCycle, 'target' | 'currency' | 'configured' | 'fee'>
    | undefined
  projectId: number | undefined
  feePerbicent: BigNumber | undefined
  total?: BigNumber
}) {
  const [form] = useForm<{
    totalPercent: number
  }>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingMods, setEditingMods] = useState<PayoutMod[]>()
  const { owner } = useContext(V1ProjectContext)
  const setPayoutModsTx = useSetPayoutModsTx()

  const fundingCycleCurrency = V1CurrencyName(
    fundingCycle?.currency.toNumber() as V1CurrencyOption,
  )

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

  const onModsChanged = useCallback(
    (newMods: PayoutMod[]) => {
      setEditingMods(newMods)
    },
    [setEditingMods],
  )

  const modsTotal = mods?.reduce((acc, curr) => acc + curr.percent, 0)
  const ownerPercent = MODS_TOTAL_PERCENT - (modsTotal ?? 0)

  const baseTotal = total ?? amountSubFee(fundingCycle?.target, feePerbicent)

  const hasEditPermission = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.SetPayoutMods,
  )

  const totalPercentage = getTotalPercentage(editingMods)

  if (!fundingCycle) return null

  const { target } = fundingCycle
  const targetIsInfinite = !target || target.eq(constants.MaxUint256)

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
                      {permyriadToPercent(mod.percent)}%
                      {!fundingCycle.target.eq(constants.MaxUint256) && (
                        <>
                          {' '}
                          (
                          <CurrencySymbol currency={fundingCycleCurrency} />
                          {formatWad(baseTotal?.mul(mod.percent).div(10000), {
                            precision: fundingCycle.currency.eq(V1_CURRENCY_ETH)
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
              {permyriadToPercent(ownerPercent)}%
              {!targetIsInfinite && (
                <>
                  {' '}
                  (
                  <CurrencySymbol currency={fundingCycleCurrency} />
                  {formatWad(baseTotal?.mul(ownerPercent).div(10000), {
                    precision: fundingCycle.currency.eq(V1_CURRENCY_ETH)
                      ? 4
                      : 0,
                    padEnd: true,
                  })}
                  )
                </>
              )}
            </div>
          }
        />
      )}

      {fundingCycle && projectId && hasEditPermission ? (
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
            title={<Trans>Edit payouts</Trans>}
            okText={
              <span>
                <Trans>Save payouts</Trans>
              </span>
            }
            onOk={() => setMods()}
            onCancel={() => {
              setModalVisible(false)
            }}
            confirmLoading={loading}
            width={720}
          >
            <div>
              <p>
                Distribute available funds to other Ethereum wallets or Juicebox
                projects as payouts. Use this to pay contributors, charities,
                Juicebox projects you depend on, or anyone else. Funds are
                distributed whenever a withdrawal is made from your project.
              </p>
              <p>
                By default, all unallocated funds can be distributed to the
                project owner's wallet.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <CsvUpload
                onChange={onModsChanged}
                templateUrl={'/assets/csv/v1-payouts-template.csv'}
                parser={parseV1PayoutModsCsv}
              />
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
              currencyName={fundingCycleCurrency}
              feePercentage={perbicentToPercent(feePerbicent)}
              targetIsInfinite={targetIsInfinite}
            />
          </Modal>
        </Form>
      ) : null}
    </div>
  )
}
