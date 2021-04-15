import { BigNumber } from '@ethersproject/bignumber'
import { Form, Input } from 'antd'
import { ContractName } from 'constants/contract-name'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import React, { useCallback, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { normalizeHandle } from 'utils/formatHandle'

import { FormItemExt } from './formItemExt'

export default function ProjectHandle({
  name,
  hideLabel,
  formItemProps,
  value,
  onChange,
}: { value: string; onChange: (val?: string) => void } & FormItemExt) {
  const [handleInputVal, setHandleInputVal] = useState<string>()

  useEffect(() => setHandleInputVal(value), [])

  const handleExists = useContractReader<boolean>({
    contract: ContractName.Projects,
    functionName: 'handleResolver',
    args: useMemo(() => {
      if (!handleInputVal) return null

      let bytes = utils.formatBytes32String(handleInputVal.toLowerCase())

      while (bytes.length > 0 && bytes.charAt(bytes.length - 1) === '0') {
        bytes = bytes.substring(0, bytes.length - 2)
      }

      return [bytes]
    }, [handleInputVal]),
    formatter: useCallback((res: BigNumber) => res?.gt(0), []),
  })

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Handle'}
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
          setHandleInputVal(val)
          onChange(val)
        }}
      />
    </Form.Item>
  )
}
