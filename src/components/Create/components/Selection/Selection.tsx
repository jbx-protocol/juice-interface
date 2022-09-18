import { Space } from 'antd'
import React, { useState } from 'react'
import { SelectionCard } from './SelectionCard'

export const SelectionContext = React.createContext<{
  selection?: string | undefined
  setSelection?: (selection: string | undefined) => void
}>({})

export const Selection: React.FC<{
  value?: string
  onChange?: (value: string | undefined) => void
}> & { Card: typeof SelectionCard } = ({ value, onChange, children }) => {
  const [selection, setSelection] = useState<string | undefined>(value)
  const _selection = value ?? selection
  const _setSelection = onChange ?? setSelection

  return (
    <SelectionContext.Provider
      value={{ selection: _selection, setSelection: _setSelection }}
    >
      <Space direction="vertical" size="middle">
        {children}
      </Space>
    </SelectionContext.Provider>
  )
}

Selection.Card = SelectionCard
