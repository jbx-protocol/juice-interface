import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ProjectTagName } from 'models/project-tags'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { useFormDispatchWatch } from '../../hooks/useFormDispatchWatch'
import { AmountInputValue } from '../ProjectDetailsPage'

type ProjectDetailsFormProps = Partial<{
  projectName: string
  projectTagline: string
  projectDescription: string
  logo: string
  coverImage: string
  projectWebsite: string
  projectTwitter: string
  projectTelegram: string
  projectDiscord: string
  projectRequiredOFACCheck?: boolean
  payButtonText: string
  payDisclosure: string
  inputProjectOwner: string
  tags: ProjectTagName[]
  // Only relevant to Juicecrowd
  introVideoUrl: string
  // Only relevant to Juicecrowd
  introImageUri: string
  // Only relevant to Juicecrowd
  softTarget: AmountInputValue
  startTimestamp: string
}>

export const useProjectDetailsForm = () => {
  const [form] = useForm<ProjectDetailsFormProps>()
  const { projectMetadata, inputProjectOwner, mustStartAtOrAfter } =
    useAppSelector(state => state.editingV2Project)

  const initialValues: ProjectDetailsFormProps = useMemo(
    () => ({
      projectName: projectMetadata.name,
      projectTagline: projectMetadata.projectTagline,
      projectDescription: projectMetadata.description,
      logo: projectMetadata.logoUri,
      coverImage: projectMetadata.coverImageUri,
      projectWebsite: projectMetadata.infoUri,
      projectTwitter: projectMetadata.twitter,
      projectTelegram: projectMetadata.telegram,
      projectDiscord: projectMetadata.discord,
      projectRequiredOFACCheck: projectMetadata.projectRequiredOFACCheck,
      payButtonText: projectMetadata.payButton,
      payDisclosure: projectMetadata.payDisclosure,
      inputProjectOwner,
      tags: projectMetadata.tags,
      // Only relevant to Juicecrowd
      introVideoUrl: projectMetadata.introVideoUrl,
      introImageUri: projectMetadata.introImageUri,
      startTimestamp:
        mustStartAtOrAfter !== DEFAULT_MUST_START_AT_OR_AFTER &&
        !isNaN(parseInt(mustStartAtOrAfter))
          ? mustStartAtOrAfter
          : '',
      softTarget:
        projectMetadata.softTargetAmount && projectMetadata.softTargetCurrency
          ? {
              amount: projectMetadata.softTargetAmount,
              currency: parseInt(
                projectMetadata.softTargetCurrency,
              ) as V2V3CurrencyOption,
            }
          : undefined,
    }),
    [
      projectMetadata.name,
      projectMetadata.projectTagline,
      projectMetadata.description,
      projectMetadata.logoUri,
      projectMetadata.coverImageUri,
      projectMetadata.infoUri,
      projectMetadata.twitter,
      projectMetadata.telegram,
      projectMetadata.discord,
      projectMetadata.payButton,
      projectMetadata.payDisclosure,
      projectMetadata.tags,
      projectMetadata.introVideoUrl,
      projectMetadata.introImageUri,
      projectMetadata.softTargetAmount,
      projectMetadata.softTargetCurrency,
      projectMetadata.projectRequiredOFACCheck,
      inputProjectOwner,
      mustStartAtOrAfter,
    ],
  )

  useFormDispatchWatch({
    form,
    fieldName: 'projectName',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setName,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTagline',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setProjectTagline,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDescription',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setDescription,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'tags',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setTags,
    formatter: v => v ?? [],
  })
  useFormDispatchWatch({
    form,
    fieldName: 'logo',
    dispatchFunction: editingV2ProjectActions.setLogoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'coverImage',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setCoverImageUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectWebsite',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setInfoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTwitter',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setTwitter,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDiscord',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setDiscord,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTelegram',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setTelegram,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'inputProjectOwner',
    ignoreUndefined: false,
    dispatchFunction: editingV2ProjectActions.setInputProjectOwner,
    formatter: v => v,
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payButtonText',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setPayButton,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payDisclosure',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setPayDisclosure,
    formatter: v => v ?? '',
  })

  useFormDispatchWatch({
    form,
    fieldName: 'introVideoUrl',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setIntroVideoUrl,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'introImageUri',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setIntroImageUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'softTarget',
    ignoreUndefined: true,
    dispatchFunction: editingV2ProjectActions.setSoftTarget,
    formatter: v => v ?? { amount: '', currency: V2V3_CURRENCY_USD },
  })

  const startTimestamp = Form.useWatch('startTimestamp', form)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!startTimestamp) return
    const launchDate = parseInt(startTimestamp)
    if (isNaN(launchDate)) return
    // check if launch date is in ms or seconds
    if (launchDate > 1000000000000) {
      dispatch(
        editingV2ProjectActions.setMustStartAtOrAfter(
          (launchDate / 1000).toString(),
        ),
      )
    } else {
      dispatch(
        editingV2ProjectActions.setMustStartAtOrAfter(launchDate.toString()),
      )
    }
  }, [dispatch, startTimestamp])

  return { form, initialValues }
}
