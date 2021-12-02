import { Form } from 'antd'
import { useCallback, useMemo, useState } from 'react'

import { FormItemExt } from './formItemExt'
import ProjectHandleInput from './ProjectHandleInput'

const DEFAULT_LABEL = 'Unique handle'

export default function ProjectHandleFormItem({
  name,
  hideLabel,
  formItemProps,
  onValueChange,
  requireState,
  returnValue,
  required,
}: {
  onValueChange?: (val: string) => void
  requireState?: 'exists' | 'notExist' // whether the handle is required to already exist or not.
  returnValue?: 'id' | 'handle'
  required?: boolean
} & FormItemExt) {
  const [handleExists, setHandleExists] = useState<Boolean>(false)

  const validator = useCallback(() => {
    if (handleExists && requireState === 'notExist')
      return Promise.reject('Handle not available')
    if (!handleExists && requireState === 'exists')
      return Promise.reject("Project doesn't exist")
    else return Promise.resolve()
  }, [handleExists, requireState])

  const formItemStatus = useMemo(() => {
    return (handleExists && requireState === 'notExist') ||
      (!handleExists && requireState === 'exists')
      ? 'warning'
      : undefined
  }, [handleExists, requireState])

  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : formItemProps?.label ?? DEFAULT_LABEL}
      status={formItemStatus}
      {...formItemProps}
      rules={[{ required }, { validator }, ...(formItemProps?.rules ?? [])]}
      validateTrigger={false}
      validateFirst
    >
      <ProjectHandleInput
        onChange={v => onValueChange?.(v ?? '')}
        requireState={requireState}
        returnValue={returnValue}
        onHandleExistsChange={setHandleExists}
      />
    </Form.Item>
  )
}
