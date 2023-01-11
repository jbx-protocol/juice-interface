import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Button, Form, Tooltip } from 'antd'
import { inputMustExistRule } from 'components/Create/components'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import Loading from 'components/Loading'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { readNetwork } from 'constants/networks'
import { TokenAddresses } from 'constants/tokenAddresses'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import useNameOfERC20 from 'hooks/NameOfERC20'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useProjectIdForHandle from 'hooks/v1/contractReader/ProjectIdForHandle'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useProjectToken from 'hooks/v2v3/contractReader/ProjectToken'
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

const useToken = (tokenAddress: string | undefined) => {
  const { data: symbol, loading: symbolLoading } =
    useSymbolOfERC20(tokenAddress)
  const { data: name, loading: nameLoading } = useNameOfERC20(tokenAddress)

  return {
    symbol,
    name,
    loading: symbolLoading || nameLoading,
  }
}

interface AddTerminalSectionForm {
  v1ProjectId: string | undefined
}

export function AddTerminalSection({
  completed,
  onCompleted,
}: {
  completed: boolean
  onCompleted: (deployedMigrationToken: string) => void
}) {
  const [form] = Form.useForm<AddTerminalSectionForm>()
  const { projectId } = useContext(ProjectMetadataContext)

  const [addTerminalLoading, setAddTerminalLoading] = useState<boolean>(false)
  const [v1ProjectHandle, setV1ProjectHandle] = useState<string>()
  const [userInputOccurring, setUserInputOccurring] = useState<boolean>(false)
  const debouncedSetV1ProjectHandle = useMemo(
    () =>
      debounce((v1ProjectHandle: string) => {
        setV1ProjectHandle(v1ProjectHandle)
        setUserInputOccurring(false)
      }, 500),
    [],
  )
  const { loading: v1ProjectIdLoading, data: v1ProjectId } =
    useProjectIdForHandle(v1ProjectHandle)
  const v1TokenAddress = useTokenAddressOfProject(v1ProjectId)
  const { data: v2TokenAddress, loading: v2TokenAddressLoading } =
    useProjectToken({
      projectId,
    })

  const v1Token = useToken(v1TokenAddress)
  const v2Token = useToken(v2TokenAddress)
  const v2TokenExists =
    v2TokenAddress && v2TokenAddress !== constants.AddressZero

  const v1ProjectHandleRequired = !v2TokenExists
  const isValidV1ProjectId = !v1ProjectId || v1ProjectId.gt(0)

  const onFinish = useCallback(
    async (values: AddTerminalSectionForm) => {
      if (v1Token.loading || v2Token.loading) return
      setAddTerminalLoading(true)
      const tokenName = v1Token.name || v2Token.name
      const tokenSymbol = v1Token.symbol || v2Token.symbol

      if (!tokenName || !tokenSymbol) {
        emitErrorNotification('Missing token name or symbol', { duration: 5 })
        setAddTerminalLoading(false)
        return
      }

      let ticketBooth: string | undefined | null
      if (isValidV1ProjectId) {
        ticketBooth = TokenAddresses.V1TicketBooth[readNetwork.name]
      }
      const tokenStore = TokenAddresses.V2TokenStore[readNetwork.name]

      // TODO:::::: add deploy call
      // eslint-disable-next-line no-console
      console.log({ ticketBooth, values, tokenStore })

      // call on completed with a random wallet address
      onCompleted('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
    },
    [isValidV1ProjectId, onCompleted, v1Token, v2Token],
  )

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
      title={<Trans>Step 1. Deploy migration token</Trans>}
      completed={completed}
    >
      {v2TokenAddressLoading ? (
        <Loading />
      ) : (
        <>
          <p>
            <Trans>
              Deploy a <ProjectVersionBadge.V3 /> migration token from legacy
              tokens.
            </Trans>
          </p>
          <div className="mb-4">
            <MinimalCollapse
              header={<Trans>What is the legacy token migration?</Trans>}
            >
              <Trans>
                Token holders of your legacy project tokens (
                <ProjectVersionBadge versionText="V1" /> or{' '}
                <ProjectVersionBadge versionText="V2" />) will have the ability
                to swap their tokens for{' '}
                <ProjectVersionBadge versionText="V3" /> tokens at a 1-to-1
                exchange rate.
              </Trans>
            </MinimalCollapse>
          </div>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={t`V1 Project Handle`}
              tooltip={t`The handle of your V1 project. This is the handle that is shown in the URL of your project page.`}
              requiredMark={v1ProjectHandleRequired ? true : 'optional'}
              required={v1ProjectHandleRequired}
            >
              <div className="flex items-center gap-2">
                <Form.Item
                  noStyle
                  name="v1ProjectHandle"
                  rules={[
                    v1ProjectHandleRequired
                      ? inputMustExistRule({ label: t`V1 Project Handle` })
                      : {},
                  ]}
                >
                  <JuiceInput
                    allowClear
                    className="flex-grow"
                    onChange={onV1ProjectHandleInputChanged}
                  />
                </Form.Item>
                {v1ProjectIdSuffix && (
                  <span className="flex-shrink whitespace-nowrap">
                    {v1ProjectIdSuffix}
                  </span>
                )}
              </div>
            </Form.Item>
            <Button
              className="mt-2"
              htmlType="submit"
              type="primary"
              size="small"
              loading={addTerminalLoading}
              disabled={
                completed ||
                userInputOccurring ||
                !isValidV1ProjectId ||
                addTerminalLoading ||
                v1ProjectIdLoading
              }
            >
              <Trans>Add terminal</Trans>
            </Button>
          </Form>
        </>
      )}
    </StepSection>
  )
}
