import { Trans } from '@lingui/macro'
import { Button, Drawer } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/shared/forms/ProjectDetailsForm'
import { ThemeContext } from 'contexts/themeContext'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useContext, useEffect } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { drawerStyle } from 'constants/styles/drawerStyle'
import StandardSaveButton from 'components/StandardSaveButton'

export function V2ReconfigureProjectDetailsDrawer({
  visible,
  onFinish,
}: {
  visible: boolean
  onFinish?: () => void
}) {
  const [projectForm] = useForm<ProjectDetailsFormFields>()
  const dispatch = useAppDispatch()
  const { projectMetadata } = useAppSelector(state => state.editingV2Project)

  const { colors } = useContext(ThemeContext).theme

  const onProjectFormSaved = useCallback(
    (fields: ProjectDetailsFormFields) => {
      dispatch(editingV2ProjectActions.setName(fields.name))
      dispatch(editingV2ProjectActions.setInfoUri(fields.infoUri))
      dispatch(editingV2ProjectActions.setLogoUri(fields.logoUri))
      dispatch(editingV2ProjectActions.setDescription(fields.description))
      dispatch(editingV2ProjectActions.setTwitter(fields.twitter))
      dispatch(editingV2ProjectActions.setDiscord(fields.discord))
      dispatch(editingV2ProjectActions.setPayButton(fields.payButton))
      dispatch(editingV2ProjectActions.setPayDisclosure(fields.payDisclosure))
      onFinish?.()
    },
    [dispatch, onFinish],
  )

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
        saveButton={<StandardSaveButton />}
      />
    </Drawer>
  )
}
