/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'

import { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { normalizeHandle } from 'utils/formatHandle'
import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
type ProjectHandleInputValue = string | undefined

interface ProjectHandleProps {
  value?: ProjectHandleInputValue
  initialValue?: string | BigNumber | undefined
  onChange?: (value: ProjectHandleInputValue) => void
  suffix?: React.ReactNode
}

export default function ProjectHandleInput({
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

  useEffect(() => {
    if (typeof initialValue === 'string') {
      setInputContents(initialValue)
    } else if (initialValue !== undefined) {
      contracts?.Projects.functions
        .handleOf(BigNumber.from(initialValue).toHexString())
        .then(res => {
          const handle = utils.parseBytes32String(res[0])
          setInputContents(handle)
        })
    }
  }, []) // eslint-disable-line

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
