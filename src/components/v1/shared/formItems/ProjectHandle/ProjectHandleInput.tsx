import { t } from '@lingui/macro'
import { Input } from 'antd'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { ethers } from 'ethers'
import { useCallback, useContext, useEffect, useState } from 'react'
import { isBigintIsh, toHexString } from 'utils/bigNumbers'
import { normalizeHandle } from 'utils/format/formatHandle'

type ProjectHandleInputValue = string | undefined
export type ProjectHandleInitialValue = string | bigint | undefined

interface ProjectHandleProps {
  onChange?: (value: ProjectHandleInputValue) => void
  suffix?: React.ReactNode
  initialValue?: ProjectHandleInitialValue
}

/**
 * Custom input component for project handles.
 *
 * This input is unidirectional. It only emits events up the tree (via `onChange`),
 * and doesn't have a `value` prop.
 *
 * Initially, it triggers `onChange` after ensuring the input contents are a string.
 * Then, it will trigger `onChange` in response to the input's `onChange` handler.
 *
 */
export function ProjectHandleInput({
  onChange,
  suffix,
  initialValue,
}: ProjectHandleProps) {
  const { contracts } = useContext(V1UserContext)
  const [inputContents, setInputContents] = useState<string>()

  const triggerChange = useCallback(
    (value: ProjectHandleInputValue) => {
      onChange?.(value)
    },
    [onChange],
  )

  // initialValue can be a string (the human-readable handle)
  // or a project ID.
  useEffect(() => {
    if (typeof initialValue === 'string') {
      setInputContents(initialValue)
      triggerChange(initialValue)
    } else if (isBigintIsh(initialValue)) {
      // TODO: Unsure if this is the correct way to handle the contract call
      contracts?.Projects.handleOf(toHexString(BigInt(initialValue))).then(
        res => {
          const handle = ethers.decodeBytes32String(res[0])
          setInputContents(handle)
          triggerChange(handle)
        },
      )
    }
    // Note: if we make `triggerChange` a dependency, this effect will
    // be triggered every re-render, we only want this to change
    // when `initialValue` changes.
  }, [initialValue, contracts?.Projects.functions]) // eslint-disable-line react-hooks/exhaustive-deps

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = normalizeHandle(e.target.value)
    setInputContents(val)
    triggerChange(val)
  }

  return (
    <Input
      value={inputContents}
      onChange={onHandleChange}
      prefix="@"
      suffix={suffix}
      className="err-suffix"
      placeholder={t`handle`}
      type="string"
      autoComplete="off"
      spellCheck={false}
    />
  )
}
