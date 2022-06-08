import { Trans } from '@lingui/macro'
import { Drawer } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/shared/forms/ProjectDetailsForm'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useCallback, useContext, useEffect, useState } from 'react'

import { uploadProjectMetadata } from 'utils/ipfs'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'

import { drawerStyle } from 'constants/styles/drawerStyle'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'

export function V2ReconfigureProjectDetailsDrawer({
  visible,
  onFinish,
}: {
  visible: boolean
  onFinish?: () => void
}) {
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const { projectMetadata } = useContext(V2ProjectContext)

  const { colors } = useContext(ThemeContext).theme

  const EditV2ProjectDetailsTx = useEditV2ProjectDetailsTx()

  async function onProjectFormSaved() {
    setLoadingSaveChanges(true)

    const fields = projectForm.getFieldsValue(true)

    const uploadedMetadata = await uploadProjectMetadata({
      name: fields.name,
      description: fields.description,
      logoUri: fields.logoUri,
      infoUri: fields.infoUri,
      twitter: fields.twitter,
      discord: fields.discord,
      payButton: fields.payButton.substring(0, PROJECT_PAY_CHARACTER_LIMIT), // Enforce limit
      payDisclosure: fields.payDisclosure,
    })

    if (!uploadedMetadata.IpfsHash) {
      setLoadingSaveChanges(false)
      return
    }

    EditV2ProjectDetailsTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onDone: () => setLoadingSaveChanges(false),
        onConfirmed: () => {
          if (onFinish) onFinish()
          projectForm.resetFields()
        },
      },
    )
  }

  const resetProjectForm = useCallback(() => {
    projectForm.setFieldsValue({
      name: projectMetadata?.name ?? '',
      infoUri: projectMetadata?.infoUri ?? '',
      logoUri: projectMetadata?.logoUri ?? '',
      description: projectMetadata?.description ?? '',
      twitter: projectMetadata?.twitter ?? '',
      discord: projectMetadata?.discord ?? '',
      payButton: projectMetadata?.payButton ?? '',
      payDisclosure: projectMetadata?.payDisclosure ?? '',
    })
  }, [
    projectMetadata?.name,
    projectMetadata?.infoUri,
    projectMetadata?.logoUri,
    projectMetadata?.description,
    projectMetadata?.twitter,
    projectMetadata?.discord,
    projectMetadata?.payDisclosure,
    projectMetadata?.payButton,
    projectForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onFinish}>
      <h3>
        <Trans>Reconfigure project details</Trans>
      </h3>
      <p style={{ color: colors.text.primary }}>
        <Trans>
          Project details reconfigurations will create a separate transaction.
        </Trans>
      </p>
      <br />
      <ProjectDetailsForm
        form={projectForm}
        onFinish={onProjectFormSaved}
        hideProjectHandle
        loading={loadingSaveChanges}
      />
    </Drawer>
  )
}
