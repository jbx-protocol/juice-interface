import { Input } from 'antd'
import { useContext, useState, useEffect, useCallback } from 'react'
import { UserContext } from 'contexts/userContext'
import { normalizeHandle } from 'utils/formatHandle'
import { BigNumber } from '@ethersproject/bignumber'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { utils } from 'ethers'

type ProjectHandleInputValue = string | undefined
export type ProjectHandleInitialValue = string | BigNumber | undefined

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
 * Then, it will trigger `onChange` in repsonse to the input's `onChange` handler.
 *
 */
export function ProjectHandleInput({
  onChange,
  suffix,
  initialValue,
}: ProjectHandleProps) {
  const { contracts } = useContext(UserContext)
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
    console.log('CHANGED', initialValue)
    if (typeof initialValue === 'string') {
      setInputContents(initialValue)
      triggerChange(initialValue)
    } else if (isBigNumberish(initialValue)) {
      contracts?.Projects.functions
        .handleOf(BigNumber.from(initialValue).toHexString())
        .then(res => {
          const handle = utils.parseBytes32String(res[0])
          setInputContents(handle)
          triggerChange(handle)
        })
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
      placeholder="handle"
      type="string"
      autoComplete="off"
      spellCheck={false}
    />
  )
}
