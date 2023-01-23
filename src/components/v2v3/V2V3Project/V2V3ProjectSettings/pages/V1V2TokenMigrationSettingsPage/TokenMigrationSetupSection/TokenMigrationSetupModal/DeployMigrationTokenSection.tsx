import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Form, Tooltip } from 'antd'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import Loading from 'components/Loading'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useDeployV3TokenTx } from 'hooks/JBV3Token/transactor/DeployV3Token'
import useProjectIdForHandle from 'hooks/v1/contractReader/ProjectIdForHandle'

import { debounce } from 'lodash'
import {
  ChangeEventHandler,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { StepSection } from './StepSection'

interface AddTerminalSectionForm {
  v1ProjectId: string | undefined
  tokenName: string
  tokenSymbol: string
}

export function DeployMigrationTokenSection({
  completed,
  onCompleted,
}: {
  completed: boolean
  onCompleted: () => void
}) {
  const { projectId } = useContext(ProjectMetadataContext)

  const [form] = Form.useForm<AddTerminalSectionForm>()
  const [deployTokenLoading, setDeployTokenLoading] = useState<boolean>(false)
  const [v1ProjectHandle, setV1ProjectHandle] = useState<string>()
  const [userInputOccurring, setUserInputOccurring] = useState<boolean>(false)

  const { loading: v1ProjectIdLoading, data: v1ProjectId } =
    useProjectIdForHandle(v1ProjectHandle)

  const isValidV1ProjectId = Boolean(v1ProjectId?.gt(0))

  const debouncedSetV1ProjectHandle = useMemo(
    () =>
      debounce((v1ProjectHandle: string) => {
        setV1ProjectHandle(v1ProjectHandle)
        setUserInputOccurring(false)
      }, 500),
    [],
  )

  const deployMigrationTokenTx = useDeployV3TokenTx()

  const onFinish = async (values: AddTerminalSectionForm) => {
    if (!projectId) return

    setDeployTokenLoading(true)

    try {
      await deployMigrationTokenTx(
        {
          tokenName: values.tokenName,
          tokenSymbol: values.tokenSymbol,
          v3ProjectId: projectId,
          v1ProjectId: v1ProjectId?.toNumber(),
        },
        {
          onConfirmed() {
            onCompleted()
            setDeployTokenLoading(false)
          },
          onError() {
            emitErrorNotification(
              t`Failed to deploy migration token. Check the development console and contact our team in the JuiceboxDAO Discord.`,
            )
          },
        },
      )
    } catch (e) {
      emitErrorNotification(
        t`Failed to deploy migration token. Check the development console and contact our team in the JuiceboxDAO Discord.`,
      )
      console.error(e)
      setDeployTokenLoading(false)
    }
  }

  const onV1ProjectHandleInputChanged: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      event => {
        // don't debounce if the input is empty
        if (!event.target.value) {
          setV1ProjectHandle('')
          debouncedSetV1ProjectHandle.cancel()
          setUserInputOccurring(false)
          return
        }

        setUserInputOccurring(true)
        debouncedSetV1ProjectHandle(event.target.value)
      },
      [debouncedSetV1ProjectHandle],
    )
  const v1ProjectIdSuffix = useMemo(() => {
    if (v1ProjectIdLoading) return <Loading size="small" />
    if (!v1ProjectHandle) return null

    if (isValidV1ProjectId)
      return (
        <span className="text-success-400 dark:text-success-300">
          <span>ID: {v1ProjectId?.toString()}</span> <CheckCircleOutlined />
        </span>
      )

    return (
      <Tooltip title={t`Project handle not found`}>
        <QuestionCircleOutlined className="text-warning-800 dark:text-warning-200" />
      </Tooltip>
    )
  }, [isValidV1ProjectId, v1ProjectHandle, v1ProjectId, v1ProjectIdLoading])

  return (
    <StepSection
      title={<Trans>2. Deploy V3 Migration Token</Trans>}
      completed={completed}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t`Token name`}
          name="tokenName"
          rules={[{ required: true }]}
        >
          <JuiceInput />
        </Form.Item>
        <Form.Item
          label={t`Token symbol`}
          name="tokenSymbol"
          rules={[{ required: true }]}
        >
          <JuiceInput />
        </Form.Item>
        <Form.Item
          label={t`V1 project handle`}
          extra={t`If you have a V1 project, add the project's handle here. Otherwise, leave this blank.`}
          requiredMark="optional"
          className="mb-2"
          tooltip={t`Holders of this V1 project's token will be able to migrate their tokens to the V3 token you're deploying.`}
        >
          <div className="flex items-center gap-2">
            <Form.Item noStyle name="v1ProjectHandle">
              <JuiceInput
                allowClear
                className="flex-grow"
                onChange={onV1ProjectHandleInputChanged}
                suffix={v1ProjectIdSuffix ?? null}
              />
            </Form.Item>
          </div>
        </Form.Item>
        <Button
          className="mt-2"
          htmlType="submit"
          type="primary"
          loading={deployTokenLoading}
          disabled={
            completed ||
            userInputOccurring ||
            (v1ProjectId !== undefined && !isValidV1ProjectId) ||
            deployTokenLoading ||
            v1ProjectIdLoading
          }
        >
          <Trans>Deploy Migration Token</Trans>
        </Button>
      </Form>
    </StepSection>
  )
}
