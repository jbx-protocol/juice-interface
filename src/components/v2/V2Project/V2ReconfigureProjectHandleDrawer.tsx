import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Divider, Drawer } from 'antd'
import Form, { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/formItems'

import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectENSName from 'hooks/v2/contractReader/ProjectENSName'
import { useProjectHandleENSTextRecord } from 'hooks/v2/contractReader/ProjectHandleENSTextRecord'
import { useEditV2ProjectHandleTx } from 'hooks/v2/transactor/EditV2ProjectHandleTx'
import { useSetENSTextRecordForHandleTx } from 'hooks/v2/transactor/SetENSTextRecordForHandleTx'
import { useCallback, useContext, useEffect, useState } from 'react'

import { v2ProjectRoute } from 'utils/routes'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function V2ReconfigureProjectHandleDrawer({
  visible,
  onFinish,
}: {
  visible: boolean | undefined
  onFinish?: () => void
}) {
  const { handle, projectId } = useContext(V2ProjectContext)
  const [ensNameForm] = useForm<{ ensName: string }>()

  const [ensNameInputDisabled, setEnsNameInputDisabled] = useState<boolean>()
  const [loadingSetENSName, setLoadingSetENSName] = useState<boolean>()
  const [loadingSetTextRecord, setLoadingSetTextRecord] = useState<boolean>()

  const textRecordValue = useProjectHandleENSTextRecord(
    handle ? handle + '.eth' : undefined,
  )

  const { data: projectEnsName } = useProjectENSName({ projectId })

  const { colors } = useContext(ThemeContext).theme

  const editV2ProjectHandleTx = useEditV2ProjectHandleTx()
  const setENSTextRecordForHandleTx = useSetENSTextRecordForHandleTx()

  useEffect(() => {
    if (projectEnsName?.length) setEnsNameInputDisabled(true)
  }, [projectEnsName])

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
          <b>juicebox.money/#{v2ProjectRoute({ handle: 'handle' })}</b>
          <br />
          <br />
          (The original URL{' '}
          <b>juicebox.money/#{v2ProjectRoute({ projectId })}</b> will continue
          to work.)
        </Trans>
      </p>

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
          as handles. Setting a handle involves 2 transactions:
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
          <FormItems.ENSName name="ensName" hideLabel />
          <Button htmlType="submit" loading={loadingSetENSName} type="primary">
            <Trans>Set ENS name</Trans>
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
          key <strong>"juicebox"</strong> and the value{' '}
          <strong>"{projectId}"</strong> (this project's ID). You can do this on
          the{' '}
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
          </a>
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
          <Trans>
            Set text record for {projectEnsName + '.eth' ?? 'ENS name'}
          </Trans>
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
