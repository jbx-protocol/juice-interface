import { BigNumber } from '@ethersproject/bignumber'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { normalizeHandle } from 'utils/formatHandle'

import { FormItemExt } from './formItemExt'
import { ThemeContext } from 'contexts/themeContext'

export default function ProjectHandle({
  name,
  hideLabel,
  formItemProps,
  onValueChange,
  value,
  requireState,
}: {
  onValueChange: (val: string) => void
  value?: string
  requireState?: 'exists' | 'notExist'
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [inputContents, setInputContents] = useState<string>()

  useLayoutEffect(() => {
    setInputContents(value)
  }, [value])

  const handle = useMemo(() => {
    if (!inputContents) return

    try {
      return utils.formatBytes32String(normalizeHandle(inputContents))
    } catch (e) {
      console.log('Error formatting handle', inputContents, e)
    }
  }, [inputContents])

  // InputContents pattern allows checking if handle exists while typing
  const handleExists = useContractReader<boolean>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [handle] : null,
    formatter: useCallback((res: BigNumber) => res?.gt(0), []),
  })

  const checkHandle = useCallback(
    (rule: any, value: any) => {
      if (handleExists && requireState === 'notExist')
        return Promise.reject('Handle not available')
      if (!handleExists && requireState === 'exists')
        return Promise.reject("Juicebox doesn't exist")
      else return Promise.resolve()
    },
    [handleExists, requireState],
  )

  let suffix: string | JSX.Element = ''

  if (handleExists && requireState === 'notExist')
    suffix = 'Handle already in use'
  if (handleExists === false && requireState === 'exists')
    suffix = inputContents ? 'Handle not found' : ''
  if (handleExists && requireState === 'exists')
    suffix = <CheckCircleOutlined style={{ color: colors.icon.success }} />

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
      initialValue={value}
    >
      <Input
        id="testinput"
        value={inputContents}
        prefix="@"
        suffix={suffix}
        className="err-suffix"
        placeholder="yourProject"
        type="string"
        autoComplete="off"
        onChange={e => {
          const val = normalizeHandle(e.target.value)
          setInputContents(val)
          onValueChange(val)
        }}
      />
    </Form.Item>
  )
}
