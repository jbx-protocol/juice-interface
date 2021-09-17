import { CheckCircleOutlined } from '@ant-design/icons'
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
  value,
  requireState,
  returnValue,
}: {
  onValueChange: (val: string) => void
  value?: string | BigNumber
  requireState?: 'exists' | 'notExist'
  returnValue?: 'id' | 'handle'
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [inputContents, setInputContents] = useState<string>()

  const { contracts } = useContext(UserContext)

  // Value can be either a project ID, or a project's handle
  useEffect(() => {
    if (typeof value === 'string') {
      setInputContents(value)
    } else if (isBigNumberish(value)) {
      contracts?.Projects.functions
        .handleOf(BigNumber.from(value).toHexString())
        .then(res => setInputContents(utils.parseBytes32String(res[0])))
    }
  }, [])

  const handle = useMemo(() => {
    if (!inputContents) return

    try {
      return utils.formatBytes32String(normalizeHandle(inputContents))
    } catch (e) {
      console.log('Error formatting handle', inputContents, e)
    }
  }, [inputContents])

  // InputContents pattern allows checking if handle exists while typing
  const idForHandle = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handle && requireState ? [handle] : null,
    callback: useCallback(
      returnValue === 'id'
        ? id => onValueChange(id?.toHexString() ?? '0x00')
        : () => null,
      [returnValue],
    ),
  })

  const handleExists = idForHandle?.gt(0)

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

  let suffix: string | JSX.Element = ''
  if (handleExists && requireState === 'notExist') {
    suffix = 'Handle already in use'
  }
  if (handleExists === false && requireState === 'exists') {
    suffix = inputContents ? 'Handle not found' : ''
  }
  if (handleExists && requireState === 'exists') {
    suffix = <CheckCircleOutlined style={{ color: colors.icon.success }} />
  }

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
        onChange={e => {
          const val = normalizeHandle(e.target.value)
          setInputContents(val)

          if (returnValue !== 'id') {
            onValueChange(val)
          }
        }}
      />
    </Form.Item>
  )
}
