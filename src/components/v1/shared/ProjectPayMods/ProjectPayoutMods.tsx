import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { FormItemExt } from 'components/formItems/formItemExt'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useContext, useState } from 'react'
import { permyriadToPercent } from 'utils/format/formatNumber'

import { CurrencyName } from 'constants/currency'

import { classNames } from 'utils/classNames'
import { ProjectModInput } from './ProjectModInput'
import { ProjectPayoutModsModal } from './ProjectPayoutModsModal'
import { EditingPayoutMod } from './types'

export default function ProjectPayoutMods({
  target,
  currencyName,
  feePercentage,
  lockedMods,
  mods,
  onModsChanged,
  targetIsInfinite,
  formItemProps,
}: {
  target: string
  currencyName: CurrencyName | undefined
  feePercentage: string | undefined
  lockedMods?: EditingPayoutMod[]
  mods: EditingPayoutMod[] | undefined
  onModsChanged: (mods: EditingPayoutMod[]) => void
  targetIsInfinite?: boolean
} & FormItemExt) {
  const [editingModalVisible, setEditingModalVisible] = useState<boolean>(false)
  const [editingModIndex, setEditingModIndex] = useState<number>()

  const { owner } = useContext(V1ProjectContext)

  const openModalWithModIndex = (index: number) => {
    setEditingModIndex(index)
    setEditingModalVisible(true)
  }

  if (!mods) return null

  const total = mods
    .concat(lockedMods ? lockedMods : [])
    .reduce(
      (acc, curr) => acc + parseFloat(permyriadToPercent(curr.percent ?? '0')),
      0,
    )

  return (
    <Form.Item
      {...formItemProps}
      className={classNames('block', formItemProps?.className)}
      style={{ ...formItemProps?.style }}
    >
      <Space className="min-h-0 w-full" direction="vertical" size="large">
        {lockedMods && (
          <Space className="w-full" direction="vertical" size="small">
            {lockedMods.map((v, i) =>
              ProjectModInput({
                mod: v,
                index: i,
                locked: true,
                target,
                targetIsInfinite,
                currencyName,
                feePercentage,
              }),
            )}
          </Space>
        )}
        <Space className="w-full" direction="vertical" size="small">
          {mods.map((v, i) => (
            <ProjectModInput
              mod={v}
              key={i}
              index={i}
              target={target}
              targetIsInfinite={targetIsInfinite}
              currencyName={currencyName}
              feePercentage={feePercentage}
              onSelect={openModalWithModIndex}
              onDelete={(index: number) => {
                onModsChanged([
                  ...mods.slice(0, index),
                  ...mods.slice(index + 1),
                ])
              }}
            />
          ))}
        </Space>
        <div className="flex justify-between text-grey-500 dark:text-grey-300">
          <div
            className={
              total > 100
                ? 'text-error-500 dark:text-error-400'
                : 'text-grey-500 dark:text-grey-300'
            }
          >
            <Trans>Total: {total.toFixed(2)}%</Trans>
          </div>
          <div>
            {owner ? (
              <Trans>
                {(100 - total).toFixed(2)}% to{' '}
                <EthereumAddress address={owner} />
              </Trans>
            ) : null}
          </div>
        </div>
        <Button
          type="dashed"
          onClick={() => {
            setEditingModalVisible(true)
          }}
          block
        >
          <Trans>Add a payout</Trans>
        </Button>
      </Space>

      <ProjectPayoutModsModal
        open={editingModalVisible}
        target={target}
        feePercentage={feePercentage}
        mods={mods}
        editingModIndex={editingModIndex}
        targetIsInfinite={targetIsInfinite}
        currencyName={currencyName}
        onOk={newMods => {
          onModsChanged(newMods)
          setEditingModIndex(undefined)
          setEditingModalVisible(false)
        }}
        onCancel={() => {
          setEditingModalVisible(false)
          setEditingModIndex(undefined)
        }}
      />
    </Form.Item>
  )
}
