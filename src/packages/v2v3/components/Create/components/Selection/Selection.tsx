import React, { CSSProperties, useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { SelectionCard } from './SelectionCard'

export const SelectionContext = React.createContext<{
  selection?: string | undefined
  defocusOnSelect?: boolean
  setSelection?: (selection: string | undefined) => void
}>({})

export const Selection: React.FC<
  React.PropsWithChildren<{
    value?: string
    defocusOnSelect?: boolean
    disableInteractivity?: boolean
    allowDeselect?: boolean
    className?: string
    style?: CSSProperties
    onChange?: (value: string | undefined) => void
  }>
> & { Card: typeof SelectionCard } = ({
  defocusOnSelect,
  disableInteractivity,
  allowDeselect = true,
  value,
  className,
  onChange,
  children,
}) => {
  const [selection, setSelection] = useState<string | undefined>(value)
  const _selection = value ?? selection
  const setSelectionWrapper = useCallback(
    (selection: string | undefined) => {
      const _setSelection = onChange ?? setSelection
      const eventIsDeselecting = selection === undefined
      if (!allowDeselect && eventIsDeselecting) return
      _setSelection?.(selection ?? '')
    },
    [allowDeselect, onChange],
  )

  return (
    <SelectionContext.Provider
      value={{
        defocusOnSelect,
        selection: _selection,
        setSelection: !disableInteractivity ? setSelectionWrapper : undefined,
      }}
    >
      <div className={twMerge('flex flex-col gap-4', className)}>
        {children}
      </div>
    </SelectionContext.Provider>
  )
}

Selection.Card = SelectionCard
