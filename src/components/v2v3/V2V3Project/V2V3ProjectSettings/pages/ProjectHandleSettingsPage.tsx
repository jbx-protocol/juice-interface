import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Divider, Form, Space, Statistic } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Callout from 'components/Callout'
import ExternalLink from 'components/ExternalLink'
import { FormItems } from 'components/formItems'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useProjectENSName from 'hooks/v2v3/contractReader/ProjectENSName'
import { useProjectHandleENSTextRecord } from 'hooks/v2v3/contractReader/ProjectHandleENSTextRecord'
import { useEditV2V3ProjectHandleTx } from 'hooks/v2v3/transactor/EditV2V3ProjectHandleTx'
import { useSetENSTextRecordForHandleTx } from 'hooks/v2v3/transactor/SetENSTextRecordForHandleTx'
import Link from 'next/link'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

export function ProjectHandleSettingsPage() {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [ensNameForm] = useForm<{ ensName: string }>()

  const [ensNameIsValid, setEnsNameIsValid] = useState<boolean>()
  const [ensNameInputDisabled, setEnsNameInputDisabled] = useState<boolean>()
  const [loadingSetENSName, setLoadingSetENSName] = useState<boolean>()
  const [loadingSetTextRecord, setLoadingSetTextRecord] = useState<boolean>()

  const textRecordValue = useProjectHandleENSTextRecord(
    handle ? handle + '.eth' : undefined,
  )

  const { data: projectEnsName } = useProjectENSName({ projectId })

  const editV2V3ProjectHandleTx = useEditV2V3ProjectHandleTx()
  const setENSTextRecordForHandleTx = useSetENSTextRecordForHandleTx()

  function onSetENSNameFormSaved() {
    setLoadingSetENSName(true)

    const ensName = String(ensNameForm.getFieldValue('ensName'))
      .toLowerCase()
      .trim()

    editV2V3ProjectHandleTx(
      { ensName },
      {
        onDone: () => setLoadingSetENSName(false),
      },
    )
  }

  function setTextRecord() {
    setLoadingSetTextRecord(true)

    setENSTextRecordForHandleTx(
      {
        ensName: projectEnsName ?? '',
        key: projectHandleENSTextRecordKey,
        value: projectId?.toString() ?? '',
      },
      {
        onDone: () => setLoadingSetTextRecord(false),
      },
    )
  }

  // initially fill form with current handle if set
  const resetHandleForm = useCallback(() => {
    ensNameForm.setFieldsValue({
      ensName: projectEnsName ?? '',
    })
  }, [ensNameForm, projectEnsName])

  useEffect(() => {
    if (projectEnsName?.length) setEnsNameInputDisabled(true)
  }, [projectEnsName])

  useEffect(() => {
    resetHandleForm()
  }, [resetHandleForm])

  const exampleHandleUrl = `juicebox.money${v2v3ProjectRoute({
    handle: 'handle',
  })}`
  const projectIdUrl = `juicebox.money${v2v3ProjectRoute({ projectId })}`

  return (
    <>
      <Space direction="vertical">
        {handle && (
          <Statistic
            title={<Trans>Current handle</Trans>}
            value={`@${handle}`}
          />
        )}

        <div>
          <p>
            <Trans>
              Juicebox projects use{' '}
              <ExternalLink href="https://ens.domains/">ENS names</ExternalLink>{' '}
              as handles. Projects with a handle have the following features:
            </Trans>
          </p>
          <p>
            <ul>
              <Space direction="vertical">
                <li>
                  <Trans>
                    Included in search results on the{' '}
                    <Link href="/projects">Projects</Link> page.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Accessible via the URL <strong>{exampleHandleUrl}</strong>.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    The original URL <strong>{projectIdUrl}</strong> will remain
                    active.
                  </Trans>
                </li>
              </Space>
            </ul>
          </p>

          <p style={{ margin: 0 }}>
            <Trans>
              Setting a handle requires 2 transactions:{' '}
              <strong>Set ENS name</strong> and <strong>Set text record</strong>
              .
            </Trans>
          </p>
        </div>
      </Space>

      <Divider />

      <h3>
        <Trans>1. Set ENS name</Trans>
      </h3>

      <p>
        <Trans>
          Choose an ENS name to use as the project's handle. Subdomains are
          allowed and will be included in the handle. Handles won't include the
          ".eth" extension.
        </Trans>
      </p>

      <MinimalCollapse
        header={<Trans>See example</Trans>}
        style={{ marginBottom: '1rem' }}
      >
        <ul>
          <Space direction="vertical">
            <li>juicebox.eth = @juicebox</li>
            <li>dao.juicebox.eth = @dao.juicebox</li>
          </Space>
        </ul>
      </MinimalCollapse>

      {ensNameInputDisabled ? (
        <div>
          <p>
            <Statistic
              title={<Trans>Project ENS name</Trans>}
              value={`${projectEnsName}.eth`}
            />
          </p>

          <Button onClick={() => setEnsNameInputDisabled(false)} type="primary">
            <Trans>Change ENS name</Trans>
          </Button>
        </div>
      ) : (
        <Form form={ensNameForm} onFinish={onSetENSNameFormSaved}>
          <FormItems.ENSName
            name="ensName"
            hideLabel
            formItemProps={{ rules: [{ required: true }] }}
            onChange={() => {
              ensNameForm
                .validateFields()
                .then(() => setEnsNameIsValid(true))
                .catch(() => setEnsNameIsValid(false))
            }}
          />
          <Button
            htmlType="submit"
            loading={loadingSetENSName}
            disabled={!ensNameIsValid}
            type="primary"
          >
            <span>
              <Trans>Set ENS name</Trans>
            </span>
          </Button>
        </Form>
      )}

      <Divider />

      <h3>
        <Trans>2. Set text record</Trans>
      </h3>

      <p>
        <Trans>
          Set a text record for{' '}
          {handle ? <strong>{handle}.eth</strong> : 'that ENS name'} with the
          key <strong>"{projectHandleENSTextRecordKey}"</strong> and the value{' '}
          <strong>"{projectId}"</strong> (this project's ID). You can do this on
          the{' '}
          <ExternalLink
            href={
              projectEnsName
                ? `https://app.ens.domains/name/${projectEnsName}.eth/details`
                : 'https://app.ens.domains'
            }
          >
            ENS app
          </ExternalLink>
          , or use the button below (as long as your connected wallet owns or
          controls that ENS name).
        </Trans>
      </p>

      {projectId && textRecordValue.data === projectId ? (
        <Button type="primary" disabled>
          <CheckCircleFilled /> <Trans>Text record is set</Trans>
        </Button>
      ) : (
        <Button
          loading={loadingSetTextRecord}
          type="primary"
          disabled={!projectEnsName}
          onClick={setTextRecord}
        >
          <span>
            <Trans>
              Set text record for {projectEnsName + '.eth' ?? 'ENS name'}
            </Trans>
          </span>
        </Button>
      )}

      {!projectEnsName && (
        <Callout>
          <Trans>Choose an ENS name before setting the text record</Trans>
        </Callout>
      )}
    </>
  )
}
