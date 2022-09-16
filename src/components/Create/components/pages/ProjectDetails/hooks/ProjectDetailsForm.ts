import { useForm } from 'antd/lib/form/Form'
import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { useFormDispatchWatch } from '../../hooks'

export type ProjectDetailsFormProps = Partial<{
  projectName: string
  projectDescription: string
  logo: string
  projectWebsite: string
  projectTwitter: string
  projectDiscord: string
  payButtonText: string
  payDisclosure: string
}>

export const useProjectDetailsForm = () => {
  const [form] = useForm<ProjectDetailsFormProps>()
  const { projectMetadata } = useAppSelector(state => state.editingV2Project)

  const initialValues: ProjectDetailsFormProps = useMemo(
    () => ({
      projectName: projectMetadata.name,
      projectDescription: projectMetadata.description,
      logo: projectMetadata.logoUri,
      projectWebsite: projectMetadata.infoUri,
      projectTwitter: projectMetadata.twitter,
      projectDiscord: projectMetadata.discord,
      payButtonText: projectMetadata.payButton,
      payDisclosure: projectMetadata.payDisclosure,
    }),
    [
      projectMetadata.description,
      projectMetadata.discord,
      projectMetadata.infoUri,
      projectMetadata.logoUri,
      projectMetadata.name,
      projectMetadata.payButton,
      projectMetadata.payDisclosure,
      projectMetadata.twitter,
    ],
  )

  useFormDispatchWatch({
    form,
    fieldName: 'projectName',
    dispatchFunction: editingV2ProjectActions.setName,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDescription',
    dispatchFunction: editingV2ProjectActions.setDescription,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'logo',
    dispatchFunction: editingV2ProjectActions.setLogoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectWebsite',
    dispatchFunction: editingV2ProjectActions.setInfoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTwitter',
    dispatchFunction: editingV2ProjectActions.setTwitter,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDiscord',
    dispatchFunction: editingV2ProjectActions.setDiscord,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payButtonText',
    dispatchFunction: editingV2ProjectActions.setPayButton,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payDisclosure',
    dispatchFunction: editingV2ProjectActions.setPayDisclosure,
    formatter: v => v ?? '',
  })

  return { form, initialValues }
}
