/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { normalizeHandle } from 'utils/formatHandle'
import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
type ProjectHandleInputValue = string | undefined

interface ProjectHandleProps {
  value?: ProjectHandleInputValue
  onChange?: (value: ProjectHandleInputValue) => void
  requireState?: 'exists' | 'notExist' // whether the handle is required to already exist or not.
  returnValue?: 'id' | 'handle'
  onHandleExistsChange?: (value: boolean) => void
}

export default function ProjectHandleInput({
  value,
  onChange,
  requireState,
  returnValue,
  onHandleExistsChange,
}: ProjectHandleProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [initialValue, setInitialValue] = useState<string>()
  const [inputContents, setInputContents] = useState<string>()
  const [handleLoading, setHandleLoading] = useState<boolean>(false)
  const [handleExists, setHandleExists] = useState<boolean>(false)

  const triggerChange = useCallback(
    (value: ProjectHandleInputValue) => {
      onChange?.(value)
    },
    [onChange],
  )

  useEffect(() => {
    setInitialValue(value)
    setInputContents(value)
    triggerChange(value)
    if (value) {
      setHandleLoading(true)
    }
  }, [value, triggerChange])

  const handleBytes = useMemo(() => {
    if (!inputContents) return

    try {
      return utils.formatBytes32String(normalizeHandle(inputContents))
    } catch (e) {
      console.error('Error formatting handle', inputContents, e)
    }
  }, [inputContents]) // 0x...

  useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handleBytes && requireState ? [handleBytes] : null,
    callback: useCallback(
      idForHandle => {
        setHandleExists(Boolean(idForHandle?.gt(0)))
        onHandleExistsChange?.(handleExists)
        setHandleLoading(false)

        if (returnValue === 'id') {
          onChange?.(idForHandle?.toHexString() ?? '0x00')
        }
      },
      [handleExists, onHandleExistsChange, returnValue, onChange],
    ),
  })

  const suffix: string | JSX.Element = useMemo(() => {
    const InputCheckIcon = (
      <CheckCircleOutlined style={{ color: colors.icon.success }} />
    )

    if (handleLoading) {
      return <LoadingOutlined spin />
    }

    // If there's no value, render nothing.
    if (!inputContents) {
      return ''
    }

    if (requireState === 'notExist') {
      // In the `notExist` case,
      // an existing handle is assumed valid if it hasn't changed from
      // the initialValue
      // (for example, if a project is editing their current handle)
      const isExistingHandleValid =
        initialValue !== undefined && inputContents === initialValue

      if (handleExists && !isExistingHandleValid) {
        return 'Handle already in use'
      }

      if (!handleExists || (handleExists && isExistingHandleValid)) {
        return InputCheckIcon
      }
    }

    if (requireState === 'exists') {
      return handleExists ? InputCheckIcon : 'Handle not found'
    }

    return ''
  }, [
    inputContents,
    handleLoading,
    handleExists,
    requireState,
    initialValue,
    colors.icon.success,
  ])

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = normalizeHandle(e.target.value)
    setInputContents(val)
    triggerChange(val)
    if (val) {
      setHandleLoading(true)
    }
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
