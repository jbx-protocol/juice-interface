import { t, Trans } from '@lingui/macro'
import { Button, Divider, Drawer, Form, notification, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import axios from 'axios'
import { FormItems } from 'components/shared/formItems'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { readNetwork } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { useAddToBalanceTx } from 'hooks/v1/transactor/AddToBalanceTx'
import { useSafeTransferFromTx } from 'hooks/v1/transactor/SafeTransferFromTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import { useTransferTokensTx } from 'hooks/v1/transactor/TransferTokensTx'
import { useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { uploadProjectMetadata } from 'utils/ipfs'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function ProjectToolDrawerModal({
  visible,
  onClose,
}: {
  visible?: boolean
  onClose?: VoidFunction
}) {
  const { tokenSymbol, owner, terminal, metadata, projectId, handle } =
    useContext(V1ProjectContext)
  const { userAddress } = useContext(NetworkContext)
  const safeTransferFromTx = useSafeTransferFromTx()
  const transferTokensTx = useTransferTokensTx()
  const addToBalanceTx = useAddToBalanceTx()
  const setUriTx = useSetProjectUriTx()

  const [loadingAddToBalance, setLoadingAddToBalance] = useState<boolean>()
  const [loadingTransferTokens, setLoadingTransferTokens] = useState<boolean>()
  const [loadingTransferOwnership, setLoadingTransferOwnership] =
    useState<boolean>()
  const [loadingArchive, setLoadingArchive] = useState<boolean>()
  const [transferTokensForm] = useForm<{ amount: string; to: string }>()
  const [addToBalanceForm] = useForm<{ amount: string }>()
  const [transferOwnershipForm] = useForm<{ to: string }>()

  const stakedTokenBalance = useUnclaimedBalanceOfUser()

  function transferOwnership() {
    setLoadingTransferOwnership(true)

    safeTransferFromTx(
      { to: transferTokensForm.getFieldValue('to') },
      {
        onDone: () => setLoadingTransferOwnership(false),
        onConfirmed: () => transferOwnershipForm.resetFields(),
      },
    )
  }

  function transferTokens() {
    setLoadingTransferTokens(true)

    const fields = transferTokensForm.getFieldsValue(true)

    transferTokensTx(
      {
        to: fields.to,
        amount: parseWad(fields.amount),
      },
      {
        onDone: () => setLoadingTransferTokens(false),
        onConfirmed: () => transferTokensForm.resetFields(),
      },
    )
  }

  function addToBalance() {
    setLoadingAddToBalance(true)

    addToBalanceTx(
      { value: parseWad(addToBalanceForm.getFieldValue('amount')) },
      {
        onDone: () => setLoadingAddToBalance(false),
        onConfirmed: () => addToBalanceForm.resetFields(),
      },
    )
  }

  async function setArchived(archived: boolean) {
    // Manual check to help avoid creating axios request when onchain tx would fail
    if (!userAddress || userAddress.toLowerCase() !== owner?.toLowerCase()) {
      notification.error({
        key: new Date().valueOf().toString(),
        message: 'Connected wallet not authorized',
        duration: 0,
      })
      return
    }

    setLoadingArchive(true)

    const uploadedMetadata = await uploadProjectMetadata({
      ...metadata,
      archived,
    })

    if (!uploadedMetadata.IpfsHash) {
      notification.error({
        key: new Date().valueOf().toString(),
        message: 'Failed to update project metadata',
        duration: 0,
      })
      setLoadingArchive(false)
      return
    }

    // Create github issue when archive is requested
    // https://docs.github.com/en/rest/reference/issues#create-an-issue
    // Do this first, in case the user closes the page before the on-chain tx completes
    axios.post(
      'https://api.github.com/repos/jbx-protocol/juice-interface/issues',
      {
        title: `[${archived ? 'ARCHIVE' : 'UNARCHIVE'}] Project: "${
          metadata?.name
        }"`,
        body: `<b>Chain:</b> ${
          readNetwork.name
        } \n <b>Handle:</b> ${handle} \n <b>Id:</b> ${projectId?.toString()}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
        },
      },
    )

    setUriTx(
      { cid: uploadedMetadata.IpfsHash },
      { onDone: () => setLoadingArchive(false) },
    )
  }

  const tokenSymbolShort = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <Drawer visible={visible} onClose={onClose} width={600}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <h1>
          <Trans>Tools</Trans>
        </h1>

        <section>
          <h3>
            <Trans>Transfer ownership</Trans>
          </h3>
          <p>
            <Trans>Current owner: {owner}</Trans>
          </p>
          <Form
            form={transferOwnershipForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item name="to" label="To">
              <FormItems.EthAddress
                defaultValue={undefined}
                onAddressChange={to =>
                  transferTokensForm.setFieldsValue({ to })
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => transferOwnership()}
                loading={loadingTransferOwnership}
                size="small"
                type="primary"
              >
                <Trans>Transfer ownership</Trans>
              </Button>
            </Form.Item>
          </Form>
        </section>

        <Divider />

        <section>
          <h3>
            <Trans>Transfer unclaimed {tokenSymbolShort}</Trans>
          </h3>
          <p>
            <Trans>
              Your balance: {formatWad(stakedTokenBalance, { precision: 0 })}
            </Trans>
          </p>
          <Form
            form={transferTokensForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item name="amount" label="Amount">
              <FormattedNumberInput
                placeholder="0"
                onChange={amount =>
                  transferTokensForm.setFieldsValue({
                    amount,
                  })
                }
                accessory={
                  <InputAccessoryButton
                    content={t`MAX`}
                    onClick={() =>
                      transferTokensForm.setFieldsValue({
                        amount: fromWad(stakedTokenBalance),
                      })
                    }
                  />
                }
              />
            </Form.Item>
            <Form.Item name="to" label="To">
              <FormItems.EthAddress
                defaultValue={undefined}
                onAddressChange={to =>
                  transferTokensForm.setFieldsValue({ to })
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => transferTokens()}
                loading={loadingTransferTokens}
                size="small"
                type="primary"
              >
                <Trans>Transfer {tokenSymbolShort}</Trans>
              </Button>
            </Form.Item>
          </Form>
        </section>

        <Divider />

        <section>
          <h3>
            <Trans>Add to Balance</Trans>
          </h3>
          <p>
            <Trans>
              Add funds to this project's balance without minting tokens.
            </Trans>
          </p>
          <Form
            form={addToBalanceForm}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item name="amount" label={t`Amount`}>
              <FormattedNumberInput
                placeholder="0"
                onChange={amount =>
                  addToBalanceForm.setFieldsValue({
                    amount,
                  })
                }
                accessory={<InputAccessoryButton content="ETH" />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => addToBalance()}
                loading={loadingAddToBalance}
                size="small"
                type="primary"
              >
                <Trans>Add to balance</Trans>
              </Button>
            </Form.Item>
          </Form>
        </section>

        <Divider />

        {metadata?.archived ? (
          <section>
            <h3>
              <Trans>Unarchive project</Trans>
            </h3>
            <p>
              <Trans>
                Your project will immediately appear active on the
                juicebox.money app. Please allow a few days for it to appear in
                the "active" projects list on the Projects page.
              </Trans>
            </p>
            <Button
              onClick={() => setArchived(false)}
              loading={loadingArchive}
              size="small"
              type="primary"
            >
              <Trans>Unarchive project</Trans>
            </Button>
          </section>
        ) : (
          <section>
            <h3>
              <Trans>Archive project</Trans>
            </h3>
            <p>
              <Trans>
                Your project will appear archived, and will not be able to
                receive payments through the juicebox.money app. You can
                unarchive a project at any time. Please allow a few days for
                your project to appear under the "archived" filter on the
                Projects page.
              </Trans>
            </p>
            <p>
              <strong>
                <Trans>Note:</Trans>
              </strong>{' '}
              {terminal?.version === '1.1' ? (
                <Trans>
                  Unless payments are paused in your funding cycle settings,
                  your project will still be able to receive payments directly
                  through the Juicebox protocol contracts.
                </Trans>
              ) : (
                <Trans>
                  Your project will still be able to receive payments directly
                  through the Juicebox protocol contracts.
                </Trans>
              )}
            </p>
            <Button
              onClick={() => setArchived(true)}
              loading={loadingArchive}
              size="small"
              type="primary"
            >
              <Trans>Archive project</Trans>
            </Button>
          </section>
        )}
      </Space>
    </Drawer>
  )
}
