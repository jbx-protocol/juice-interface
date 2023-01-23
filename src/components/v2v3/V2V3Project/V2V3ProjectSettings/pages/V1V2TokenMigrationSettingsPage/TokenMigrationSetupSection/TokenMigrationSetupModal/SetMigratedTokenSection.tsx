import { t, Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { StepSection } from './StepSection'
import { useCallback, useEffect } from 'react'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { inputMustExistRule } from 'utils/antd-rules'

export const SetMigratedTokenSection = ({
  deployedMigrationToken,
  completed,
  onCompleted,
}: {
  deployedMigrationToken: string | undefined
  completed: boolean
  onCompleted: VoidFunction
}) => {
  const [form] = Form.useForm()

  const onFinish = useCallback(
    values => {
      const migratedTokenAddress = values.migratedTokenAddress as string
      // TODO: Call setFor for token address
      // eslint-disable-next-line no-console
      console.log('migratedTokenAddress', migratedTokenAddress)
      onCompleted()
    },
    [onCompleted],
  )

  useEffect(() => {
    form.setFieldValue('migratedTokenAddress', deployedMigrationToken)
  }, [deployedMigrationToken, form])

  return (
    <StepSection title={t`2. Update your project token`} completed={completed}>
      <p>
        <Trans>
          Set the newly deployed <ProjectVersionBadge.V3 /> token from Step 1 as
          your project's token.
        </Trans>
      </p>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="migratedTokenAddress"
          label={t`Deployed Migration Token Address`}
          tooltip={t`The address of the token that was deployed in Step 1.`}
          rules={[
            inputMustExistRule({
              label: t`Deployed Migration Token Address`,
            }),
          ]}
        >
          <JuiceInput />
        </Form.Item>
        <Button className="mt-2" type="primary" htmlType="submit">
          Set token
        </Button>
      </Form>
    </StepSection>
  )
}
