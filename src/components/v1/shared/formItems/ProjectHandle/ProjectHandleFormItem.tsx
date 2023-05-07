import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Form } from 'antd'
import { FormItemExt } from 'components/formItems/formItemExt'
import { BigNumber, utils } from 'ethers'
import useContractReader from 'hooks/v1/contractReader/useContractReader'
import { V1ContractName } from 'models/v1/contracts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { normalizeHandle } from 'utils/format/formatHandle'

import {
  ProjectHandleInitialValue,
  ProjectHandleInput,
} from './ProjectHandleInput'

/**
 * Custom Form.Item component for project handles.
 */
export default function ProjectHandleFormItem({
  name,
  hideLabel,
  formItemProps,
  onValueChange,
  requireState,
  required,
  returnValue,
  initialValue,
}: {
  onValueChange?: (val: string) => void
  requireState?: 'exists' | 'notExist'
  required?: boolean
  returnValue?: 'id' | 'handle'
  initialValue?: ProjectHandleInitialValue
} & FormItemExt) {
  const [inputContents, setInputContents] = useState<string>()
  const [handleLoading, setHandleLoading] = useState<boolean>(false)

  // Set the initial state.
  useEffect(() => {
    // If there's an existing value, set loading state
    // and disable input while we wait for loading to finish.
    if (initialValue) {
      setHandleLoading(true)
    }
  }, [initialValue])

  const handleHex = useMemo(() => {
    if (!inputContents) return

    try {
      return utils.formatBytes32String(normalizeHandle(inputContents))
    } catch (e) {
      console.error('Error formatting handle', inputContents, e)
    }
  }, [inputContents]) // 0xabc...

  const idForHandle = useContractReader<BigNumber>({
    contract: V1ContractName.Projects,
    functionName: 'projectFor',
    args: handleHex && requireState ? [handleHex] : null,
    callback: useCallback(
      (id: BigNumber | undefined) => {
        setHandleLoading(false)

        if (returnValue === 'id') {
          onValueChange?.(id?.toHexString() ?? '0x00')
        }
      },
      [onValueChange, returnValue],
    ),
  })

  const handleExists = Boolean(idForHandle?.gt(0))

  // Validator function for Form.Item
  const validator = useCallback(() => {
    if (handleExists && requireState === 'notExist')
      return Promise.reject('Handle not available')
    if (!handleExists && requireState === 'exists')
      return Promise.reject("Project doesn't exist")
    else return Promise.resolve()
  }, [handleExists, requireState])

  const suffix: string | JSX.Element = useMemo(() => {
    const InputCheckIcon = (
      <CheckCircleOutlined className="text-success-700 dark:text-success-200" />
    )

    if (handleLoading) {
      return <LoadingOutlined spin />
    }
    if (!inputContents) {
      return ''
    }
    if (requireState === 'notExist') {
      // In the `notExist` case,
      // an existing handle is assumed valid if it hasn't changed from
      // the initialValue (for example, if a project is editing their current handle).
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
  }, [inputContents, handleLoading, handleExists, requireState, initialValue])

  const onChange = (val: string | undefined) => {
    setInputContents(val)
    if (val) {
      setHandleLoading(true)
    }
    // Only trigger onValueChange when
    // return value is not `id`.
    // We handle `id` type in contract
    // reader above.
    if (returnValue !== 'id') {
      onValueChange?.(val ?? '')
    }
  }

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : formItemProps?.label ?? t`Project handle`}
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
