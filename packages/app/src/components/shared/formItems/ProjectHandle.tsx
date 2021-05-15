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
  value,
}: { value: string } & FormItemExt) {
  const [inputContents, setInputContents] = useState<string>()

  useEffect(() => setInputContents(value), [value, setInputContents])

  // InputContents pattern allows checking if handle exists while typing
  const handleExists = useContractReader<boolean>({
    contract: ContractName.Projects,
    functionName: 'handleResolver',
    args: useMemo(() => {
      if (!inputContents) return null

      let bytes = utils.formatBytes32String(inputContents.toLowerCase())

      while (bytes.length > 0 && bytes.charAt(bytes.length - 1) === '0') {
        bytes = bytes.substring(0, bytes.length - 2)
      }

      return [bytes]
    }, [inputContents]),
    formatter: useCallback((res: BigNumber) => res?.gt(0), []),
  })

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Unique handle'}
      extra={
        handleExists ? (
          <span style={{ color: 'red' }}>Handle not available</span>
        ) : undefined
      }
      status={handleExists ? 'warning' : undefined}
      {...formItemProps}
    >
      <Input
        prefix="@"
        placeholder="yourProject"
        type="string"
        autoComplete="off"
        value={value}
        onChange={e => {
          const val = normalizeHandle(e.target.value)
          setInputContents(val)
        }}
      />
    </Form.Item>
  )
}
