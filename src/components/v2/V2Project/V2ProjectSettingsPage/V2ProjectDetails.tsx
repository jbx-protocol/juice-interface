import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/forms/ProjectDetailsForm'
import { ThemeContext } from 'contexts/themeContext'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { revalidateProject } from 'utils/revalidateProject'

import { Trans } from '@lingui/macro'

import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'

const V2ProjectDetails = () => {
  const { colors } = useContext(ThemeContext).theme

  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const { projectMetadata, projectId } = useContext(V2ProjectContext)

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
        onConfirmed: async () => {
          if (projectId) {
            await revalidateProject({
              cv: '2',
              projectId: String(projectId),
            })
          }
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
    <>
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
    </>
  )
}

export default V2ProjectDetails
