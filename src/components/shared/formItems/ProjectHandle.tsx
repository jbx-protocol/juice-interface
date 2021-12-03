import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Form } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { normalizeHandle } from 'utils/formatHandle'

import ProjectHandleInput from './ProjectHandleInput'
import { FormItemExt } from './formItemExt'

export default function ProjectHandleFormItem({
  name,
  hideLabel,
  formItemProps,
  onValueChange,
  requireState,
  returnValue,
  required,
  initialValue,
}: {
  onValueChange?: (val: string) => void
  requireState?: 'exists' | 'notExist'
  required?: boolean
  returnValue?: 'id' | 'handle'
  initialValue?: string | BigNumber | undefined
} & FormItemExt) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { contracts } = useContext(UserContext)
  const [inputContents, setInputContents] = useState<string>()
  const [handleLoading, setHandleLoading] = useState<boolean>(false)

  const handle = useMemo(() => {
    if (!inputContents) return

    try {
      return utils.formatBytes32String(normalizeHandle(inputContents))
    } catch (e) {
      console.log('Error formatting handle', inputContents, e)
    }
  }, [inputContents])

  useEffect(() => {
    console.log('setting initivalue', initialValue)
    if (initialValue) {
      setHandleLoading(true)
    }

    if (typeof initialValue === 'string') {
      setInputContents(initialValue)
    } else if (initialValue !== undefined) {
      contracts?.Projects.functions
        .handleOf(BigNumber.from(initialValue).toHexString())
        .then(res => {
          const handle = utils.parseBytes32String(res[0])
          console.log('here', handle)
          setInputContents(handle)
        })
    }
  }, [initialValue, contracts?.Projects.functions])

  // InputContents pattern allows checking if handle exists while typing
  const idForHandle = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handle && requireState ? [handle] : null,
    callback: useCallback(
      id => {
        setHandleLoading(false)

        if (returnValue === 'id') {
          onValueChange?.(id?.toHexString() ?? '0x00')
        }
      },
      [onValueChange, returnValue],
    ),
  })

  const handleExists = idForHandle?.gt(0)

  const validator = useCallback(() => {
    if (handleExists && requireState === 'notExist')
      return Promise.reject('Handle not available')
    if (!handleExists && requireState === 'exists')
      return Promise.reject("Project doesn't exist")
    else return Promise.resolve()
  }, [handleExists, requireState])

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

  const onChange = (val: string | undefined) => {
    setInputContents(val)
    if (val) {
      setHandleLoading(true)
    }
  }

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : formItemProps?.label ?? 'Unique handle'}
      {...formItemProps}
      rules={[{ required }, { validator }, ...(formItemProps?.rules ?? [])]}
      validateTrigger={false}
      validateFirst
    >
      <ProjectHandleInput
        onChange={onChange}
        initialValue={initialValue}
        suffix={suffix}
      />
    </Form.Item>
  )
}
