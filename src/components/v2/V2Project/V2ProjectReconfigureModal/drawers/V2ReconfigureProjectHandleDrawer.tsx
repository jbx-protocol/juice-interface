import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Divider, Drawer } from 'antd'
import Form, { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'

import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectENSName from 'hooks/v2/contractReader/ProjectENSName'
import { useProjectHandleENSTextRecord } from 'hooks/v2/contractReader/ProjectHandleENSTextRecord'
import { useEditV2ProjectHandleTx } from 'hooks/v2/transactor/EditV2ProjectHandleTx'
import { useSetENSTextRecordForHandleTx } from 'hooks/v2/transactor/SetENSTextRecordForHandleTx'
import { useCallback, useContext, useEffect, useState } from 'react'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function V2ReconfigureProjectHandleDrawer({
  visible,
  onFinish,
}: {
  visible: boolean
  onFinish?: () => void
}) {
  const { handle, projectId } = useContext(V2ProjectContext)
  const [ensNameForm] = useForm<{ ensName: string }>()

  const [loadingSetENSName, setLoadingSetENSName] = useState<boolean>()
  const [loadingSetTextRecord, setLoadingSetTextRecord] = useState<boolean>()

  const textRecordValue = useProjectHandleENSTextRecord(
    handle ? handle + '.eth' : undefined,
  )

  const { data: projectEnsName } = useProjectENSName({ projectId })

  const { colors } = useContext(ThemeContext).theme

  const editV2ProjectHandleTx = useEditV2ProjectHandleTx()
  const setENSTextRecordForHandleTx = useSetENSTextRecordForHandleTx()

  function onSetENSNameFormSaved() {
    setLoadingSetENSName(true)

    const ensName = ensNameForm.getFieldValue('ensName')

    editV2ProjectHandleTx(
      { ensName },
      {
        onDone: () => setLoadingSetENSName(false),
      },
    )
  }

  function setTextRecord() {
    setLoadingSetTextRecord(true)

    setENSTextRecordForHandleTx(
      { ensName: projectEnsName ?? '' },
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
    <Drawer visible={visible} {...drawerStyle} onClose={onFinish}>
      <h3>
        <Trans>Set project handle</Trans>
      </h3>
      <div>
        <strong>Current handle:</strong>{' '}
        {handle ? (
          <span>@{handle}</span>
        ) : (
          <span style={{ color: colors.text.disabled }}>not set</span>
        )}
      </div>
      <Divider />
      <p style={{ color: colors.text.primary }}>
        <Trans>
          Juicebox projects use{' '}
          <a
            href="https://ens.domains/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ENS names
          </a>{' '}
          as handles. Setting a handle requires 2 transactions:
        </Trans>
      </p>
      <h4>
        <Trans>1. Set ENS name</Trans>
      </h4>
      <p style={{ color: colors.text.primary }}>
        <Trans>
          Choose the ENS name to use as the project's handle, with an optional
          subdomain. The handle won't include the ".eth" extension.
        </Trans>
      </p>
      <br />
      <Form form={ensNameForm} onFinish={onSetENSNameFormSaved}>
        <FormItems.ENSName subdomainCount={1} name="handle" />
        <Button htmlType="submit" loading={loadingSetENSName} type="primary">
          <Trans>Set ENS name</Trans>
        </Button>
      </Form>
      <Divider />
      <h4>
        <Trans>2. Set text record</Trans>
      </h4>
      <p style={{ color: colors.text.primary }}>
        <Trans>
          Set a text record for {handle ? handle + '.eth' : 'that ENS name'}{' '}
          with the key <strong>"juicebox"</strong> and the value{' '}
          <strong>"{projectId}"</strong> (this project's ID). You can do this
          via the{' '}
          <a
            href={
              projectEnsName
                ? `https://app.ens.domains/name/${projectEnsName}/details`
                : 'https://app.ens.domains'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            ENS app
          </a>{' '}
          , or using the button below (as long as your connected wallet has
          permission to edit records for that ENS name).
        </Trans>
      </p>
      <br />
      {projectId && textRecordValue.data === projectId ? (
        <Button type="primary" disabled icon={CheckCircleFilled}>
          <Trans>Text record is set</Trans>
        </Button>
      ) : (
        <Button
          loading={loadingSetTextRecord}
          type="primary"
          disabled={!projectEnsName}
          onClick={setTextRecord}
        >
          <Trans>Set text record for {projectEnsName ?? 'ENS name'}</Trans>
        </Button>
      )}
      {!projectEnsName && (
        <p style={{ color: colors.text.secondary }}>
          Choose an ENS name before setting the text record
        </p>
      )}
    </Drawer>
  )
}
