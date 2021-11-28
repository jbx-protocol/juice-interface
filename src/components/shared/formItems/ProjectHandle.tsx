import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { Form, Input } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { normalizeHandle } from 'utils/formatHandle'

import { FormItemExt } from './formItemExt'

export default function ProjectHandle({
  name,
  hideLabel,
  formItemProps,
  onValueChange,
  initialValue,
  requireState,
  returnValue,
}: {
  onValueChange?: (val: string) => void
  initialValue?: string | BigNumber
  requireState?: 'exists' | 'notExist' // whether the handle is required to already exist or not.
  returnValue?: 'id' | 'handle'
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [inputContents, setInputContents] = useState<string>()
  const [handleLoading, setHandleLoading] = useState<boolean>(false)
  const { contracts } = useContext(UserContext)

  // initialValue can be either a project ID, or a project's handle
  useEffect(() => {
    if (initialValue) {
      setHandleLoading(true)
    }
    if (typeof initialValue === 'string') {
      setInputContents(initialValue)
    } else if (isBigNumberish(initialValue)) {
      contracts?.Projects.functions
        .handleOf(BigNumber.from(initialValue).toHexString())
        .then(res => setInputContents(utils.parseBytes32String(res[0])))
    }
  }, [contracts, value])

  const handle = useMemo(() => {
    if (!inputContents) return

    try {
      return utils.formatBytes32String(normalizeHandle(inputContents))
    } catch (e) {
      console.log('Error formatting handle', inputContents, e)
    }
  }, [inputContents])

  // inputContents pattern allows checking if handle exists while typing
  const idForHandle = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handle && requireState ? [handle] : null,
    callback: useCallback(
      id => {
        setHandleLoading(false)
        if (returnValue === 'id' && onValueChange) {
          onValueChange(id?.toHexString() ?? '0x00')
        }
      },
      [returnValue, onValueChange],
    ),
  })

  const handleExists = Boolean(idForHandle?.gt(0))

  /**
   * checkHandle is the validator for the input field.
   */
  const checkHandle = useCallback(
    (rule: any, value: any) => {
      if (handleExists && requireState === 'notExist')
        return Promise.reject('Handle not available')
      if (!handleExists && requireState === 'exists')
        return Promise.reject("Project doesn't exist")
      else return Promise.resolve()
    },
    [handleExists, requireState],
  )

  const suffix: string | JSX.Element = useMemo(() => {
    if (handleLoading) {
      return <LoadingOutlined spin />
    }
    if (!inputContents) {
      return ''
    }
    if (handleExists && requireState === 'notExist') {
      return 'Handle already in use'
    }
    if (!handleExists && requireState === 'exists') {
      return 'Handle not found'
    }
    if (handleExists && requireState === 'exists') {
      return <CheckCircleOutlined style={{ color: colors.icon.success }} />
    }

    return ''
  }, [
    inputContents,
    handleLoading,
    handleExists,
    requireState,
    colors.icon.success,
  ])

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : formItemProps?.label ?? 'Unique handle'}
      status={
        (handleExists && requireState === 'notExist') ||
        (!handleExists && requireState === 'exists')
          ? 'warning'
          : undefined
      }
      {...formItemProps}
      rules={[{ validator: checkHandle }, ...(formItemProps?.rules ?? [])]}
      validateTrigger={false}
    >
      <Input
        id="testinput"
        value={inputContents}
        prefix="@"
        suffix={suffix}
        className="err-suffix"
        placeholder="handle"
        type="string"
        autoComplete="off"
        spellCheck={false}
        onChange={e => {
          const val = normalizeHandle(e.target.value)
          setInputContents(val)
          if (val) {
            setHandleLoading(true)
          }
        }}
      />
    </Form.Item>
  )
}
