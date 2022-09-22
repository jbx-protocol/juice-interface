import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Divider, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ExternalLink from 'components/ExternalLink'
import { FormItems } from 'components/formItems'

import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useProjectENSName from 'hooks/v2v3/contractReader/ProjectENSName'
import { useProjectHandleENSTextRecord } from 'hooks/v2v3/contractReader/ProjectHandleENSTextRecord'
import { useEditV2V3ProjectHandleTx } from 'hooks/v2v3/transactor/EditV2V3ProjectHandleTx'
import { useSetENSTextRecordForHandleTx } from 'hooks/v2v3/transactor/SetENSTextRecordForHandleTx'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { v2ProjectRoute } from 'utils/routes'

import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'

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

  const { colors } = useContext(ThemeContext).theme

  const editV2V3ProjectHandleTx = useEditV2V3ProjectHandleTx()
  const setENSTextRecordForHandleTx = useSetENSTextRecordForHandleTx()

  useEffect(() => {
    if (projectEnsName?.length) setEnsNameInputDisabled(true)
  }, [projectEnsName])

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
    resetHandleForm()
  }, [resetHandleForm])

  return (
    <>
      <h3>
        {handle ? (
          <Trans>Change project handle</Trans>
        ) : (
          <Trans>Set project handle</Trans>
        )}
      </h3>

      {handle && (
        <div style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>@{handle}</div>
      )}

      <p>
        <Trans>
          Projects with a handle:
          <br />
          <br />
          1. Are included in search results on the projects page
          <br />
          2. Can be accessed via the URL:{' '}
          <b>juicebox.money{v2ProjectRoute({ handle: 'handle' })}</b>
          <br />
          <br />
          (The original URL <b>
            juicebox.money{v2ProjectRoute({ projectId })}
          </b>{' '}
          will continue to work.)
        </Trans>
      </p>

      <Divider />

      <p style={{ color: colors.text.primary }}>
        <Trans>
          Juicebox projects use{' '}
          <ExternalLink href="https://ens.domains/">ENS names</ExternalLink> as
          handles. Setting a handle involves 2 transactions:
        </Trans>
      </p>

      <br />

      <h4>
        <Trans>1. Set ENS name</Trans>
      </h4>

      <p style={{ color: colors.text.primary }}>
        <Trans>
          Choose an ENS name to use as the project's handle. Subdomains are
          allowed and will be included in the handle. Handles won't include the
          ".eth" extension.
          <br />
          <br />
          juicebox.eth = @juicebox
          <br />
          dao.juicebox.eth = @dao.juicebox
        </Trans>
      </p>

      {ensNameInputDisabled ? (
        <div>
          <strong>ENS Name:</strong> {projectEnsName}.eth
          <br />
          <br />
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

      <h4>
        <Trans>2. Set text record</Trans>
      </h4>

      <p style={{ color: colors.text.primary }}>
        <Trans>
          Set a text record for{' '}
          {handle ? <strong>{handle}.eth</strong> : 'that ENS name'} with the
          key <strong>"{projectHandleENSTextRecordKey}"</strong> and the value{' '}
          <strong>"{projectId}"</strong> (this project's ID). You can do this on
          the{' '}
          <ExternalLink
            href={
              projectEnsName
                ? `https://app.ens.domains/name/${projectEnsName}/details`
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
        <p style={{ color: colors.text.secondary }}>
          Choose an ENS name before setting the text record
        </p>
      )}
    </>
  )
}
