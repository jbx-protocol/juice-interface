import { useForm, useWatch } from 'antd/lib/form/Form'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

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
  const [form] = useForm()
  const dispatch = useAppDispatch()
  const { projectMetadata } = useAppSelector(state => state.editingV2Project)

  const projectName = useWatch('projectName', form)
  const projectDescription = useWatch('projectDescription', form)
  const logo = useWatch('logo', form)
  const projectWebsite = useWatch('projectWebsite', form)
  const projectTwitter = useWatch('projectTwitter', form)
  const projectDiscord = useWatch('projectDiscord', form)
  const payButtonText = useWatch('payButtonText', form)
  const payDisclosure = useWatch('payDisclosure', form)

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

  useEffect(() => {
    if (projectName) {
      dispatch(editingV2ProjectActions.setName(projectName))
    }
    if (projectDescription) {
      dispatch(editingV2ProjectActions.setDescription(projectDescription))
    }
    if (logo) {
      dispatch(editingV2ProjectActions.setLogoUri(logo))
    }
    if (projectWebsite) {
      dispatch(editingV2ProjectActions.setInfoUri(projectWebsite))
    }
    if (projectTwitter) {
      dispatch(editingV2ProjectActions.setTwitter(projectTwitter))
    }
    if (projectDiscord) {
      dispatch(editingV2ProjectActions.setDiscord(projectDiscord))
    }
    if (payButtonText) {
      dispatch(editingV2ProjectActions.setPayButton(payButtonText))
    }
    if (payDisclosure) {
      dispatch(editingV2ProjectActions.setPayDisclosure(payDisclosure))
    }
  }, [
    dispatch,
    logo,
    payButtonText,
    payDisclosure,
    projectDescription,
    projectDiscord,
    projectName,
    projectTwitter,
    projectWebsite,
  ])

  return { form, initialValues }
}
