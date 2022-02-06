import { Trans } from '@lingui/macro'
import { Checkbox } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

import { CheckboxOnChange } from './ProjectsFilterAndSort'

export default function FilterCheckboxItem({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: CheckboxOnChange
  disabled?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const filterDropdownItemStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: 40,
  }

  return (
    <div
      style={{
        ...filterDropdownItemStyles,
        color: disabled ? colors.text.tertiary : '',
        cursor: 'pointer',
      }}
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        style={{ marginRight: 10 }}
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
      />
      <Trans>{label}</Trans>
    </div>
  )
}
