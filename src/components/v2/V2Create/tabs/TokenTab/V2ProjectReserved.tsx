import { Form, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import React, { CSSProperties, useContext, useState } from 'react'
import { TicketMod } from 'models/mods'

import NumberSlider from 'components/shared/inputs/NumberSlider'
import { FormItemExt } from 'components/shared/formItems/formItemExt'
import { FormItems } from 'components/shared/formItems'

export default function V2ProjectReserved({
  name,
  hideLabel,
  formItemProps,
  value,
  reserveTokenSplits,
  setReserveTokenSplits,
  style = {},
  onChange,
  disabled,
  toggleDisabled,
}: {
  value: number | undefined
  reserveTokenSplits: TicketMod[]
  setReserveTokenSplits: (splits: TicketMod[]) => void
  style?: CSSProperties
  onChange: (val?: number) => void
  disabled?: boolean
  toggleDisabled?: (checked: boolean) => void
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  // Using a state here because relying on the form does not
  // pass through updated reservedRate to ProjectTicketMods
  const [reservedRate, setReservedRate] = useState<number | undefined>(value)

  return (
    <Form.Item
      name={name}
      label={
        hideLabel ? undefined : (
          <div>
            <span>
              <Trans>Reserved rate</Trans>{' '}
            </span>
            {toggleDisabled ? (
              <React.Fragment>
                <Switch
                  checked={!disabled}
                  onChange={checked => {
                    if (!checked) {
                      setReservedRate(0)
                    } else {
                      setReservedRate(50)
                    }
                    toggleDisabled(checked)
                  }}
                />{' '}
                {disabled ? (
                  <span style={{ color: colors.text.tertiary }}>
                    <Trans>(0%)</Trans>
                  </span>
                ) : null}
              </React.Fragment>
            ) : null}
          </div>
        )
      }
      style={style}
      {...formItemProps}
    >
      <p style={{ color: colors.text.secondary }}>
        <Trans>
          Whenever someone pays your project, this percentage of tokens will be
          reserved and the rest will go to the payer. Reserve tokens are
          reserved for the project owner by default, but can also be allocated
          to other wallet addresses by the owner. Once tokens are reserved,
          anyone can "mint" them, which distributes them to their intended
          receivers.
        </Trans>
      </p>
      {!disabled ? (
        <>
          <NumberSlider
            sliderValue={value}
            defaultValue={value ?? 0}
            suffix="%"
            onChange={val => {
              setReservedRate(val)
              onChange(val)
            }}
            name={name}
            step={0.5}
          />
          <FormItems.ProjectTicketMods
            mods={reserveTokenSplits}
            onModsChanged={splits => {
              setReserveTokenSplits(splits)
            }}
            formItemProps={{
              label: t`Reserved token allocation (optional)`,
              extra: t`Allocate a portion of your project's reserved tokens to other Ethereum wallets or Juicebox projects.`,
            }}
            reservedRate={reservedRate ?? 0}
          />
        </>
      ) : null}
    </Form.Item>
  )
}
