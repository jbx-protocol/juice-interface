import { Space } from 'antd'
import React, { CSSProperties, useCallback, useState } from 'react'
import { SelectionCard } from './SelectionCard'

export const SelectionContext = React.createContext<{
  selection?: string | undefined
  defocusOnSelect?: boolean
  setSelection?: (selection: string | undefined) => void
}>({})

export const Selection: React.FC<{
  value?: string
  defocusOnSelect?: boolean
  disableInteractivity?: boolean
  style?: CSSProperties
  onChange?: (value: string | undefined) => void
}> & { Card: typeof SelectionCard } = ({
  defocusOnSelect,
  disableInteractivity,
  value,
  style,
  onChange,
  children,
}) => {
  const [selection, setSelection] = useState<string | undefined>(value)
  const _selection = value ?? selection
  const setSelectionWrapper = useCallback(
    (selection: string | undefined) => {
      const _setSelection = onChange ?? setSelection
      // This is required or get a bug where residual data causes weird toggling
      _setSelection?.(selection ?? '')
    },
    [onChange],
  )

  return (
    <SelectionContext.Provider
      value={{
        defocusOnSelect,
        selection: _selection,
        setSelection: !disableInteractivity ? setSelectionWrapper : undefined,
      }}
    >
      <Space direction="vertical" size="middle" style={style}>
        {children}
      </Space>
    </SelectionContext.Provider>
  )
}

Selection.Card = SelectionCard
