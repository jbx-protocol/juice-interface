import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext, useState } from 'react'
import { permyriadToPercent } from 'utils/formatNumber'
import FormattedAddress from 'components/shared/FormattedAddress'
import { FormItemExt } from 'components/shared/formItems/formItemExt'

import { CurrencyName } from 'constants/currency'

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
  // TODO: Do we need a separate locked mods
  lockedMods?: EditingPayoutMod[]
  mods: EditingPayoutMod[] | undefined
  onModsChanged: (mods: EditingPayoutMod[]) => void
  targetIsInfinite?: boolean
} & FormItemExt) {
  const [editingModalVisible, setEditingModalVisible] = useState<boolean>(false)
  const [editingModIndex, setEditingModIndex] = useState<number>()

  const { owner } = useContext(V1ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
      style={{ ...formItemProps?.style, display: 'block' }}
    >
      <Space
        direction="vertical"
        style={{ width: '100%', minHeight: 0 }}
        size="large"
      >
        {lockedMods && (
          <Space style={{ width: '100%' }} direction="vertical" size="small">
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
        <Space style={{ width: '100%' }} direction="vertical" size="small">
          {mods.map((v, i) =>
            ProjectModInput({
              mod: v,
              index: i,
              target,
              targetIsInfinite,
              currencyName,
              feePercentage,
              onSelect: openModalWithModIndex,
              onDelete: index => {
                onModsChanged([
                  ...mods.slice(0, index),
                  ...mods.slice(index + 1),
                ])
              },
            }),
          )}
        </Space>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: colors.text.secondary,
          }}
        >
          <div
            style={{
              color: total > 100 ? colors.text.warn : colors.text.secondary,
            }}
          >
            <Trans>Total: {total.toFixed(2)}%</Trans>
          </div>
          <div>
            {owner ? (
              <Trans>
                {(100 - total).toFixed(2)}% to{' '}
                <FormattedAddress address={owner} />
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
        visible={editingModalVisible}
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
