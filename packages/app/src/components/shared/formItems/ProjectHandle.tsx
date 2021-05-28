import { BigNumber } from '@ethersproject/bignumber'
import { Form, Input } from 'antd'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { normalizeHandle } from 'utils/formatHandle'

import { FormItemExt } from './formItemExt'

export default function ProjectHandle({
  name,
  hideLabel,
  formItemProps,
  onValueChange,
  value,
}: {
  onValueChange: (val: string) => void
  value?: string
} & FormItemExt) {
  const [inputContents, setInputContents] = useState<string>()

  useEffect(() => {
    setInputContents(value)
  }, [value])

  // InputContents pattern allows checking if handle exists while typing
  const handleExists = useContractReader<boolean>({
    contract: ContractName.Projects,
    functionName: 'handleResolver',
    args: inputContents
      ? [utils.formatBytes32String(normalizeHandle(inputContents))]
      : null,
    formatter: useCallback((res: BigNumber) => res?.gt(0), []),
  })

  const checkHandle = useCallback(
    (rule: any, value: any) => {
      if (handleExists) return Promise.reject('Handle not available')
      else return Promise.resolve()
    },
    [handleExists],
  )

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Unique handle'}
      status={handleExists ? 'warning' : undefined}
      {...formItemProps}
      rules={[{ validator: checkHandle }, ...(formItemProps?.rules ?? [])]}
      validateTrigger={false}
    >
      <Input
        id="testinput"
        value={inputContents}
        prefix="@"
        suffix={handleExists ? 'Handle taken' : ''}
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
