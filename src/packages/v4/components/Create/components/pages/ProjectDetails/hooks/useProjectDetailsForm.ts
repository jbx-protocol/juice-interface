import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  creatingV2ProjectActions,
} from 'redux/slices/v2v3/creatingV2Project'
import { DEFAULT_PROJECT_CHAIN_ID, SupportedChainId } from 'constants/networks'
import { useEffect, useMemo } from 'react'

import { AmountInputValue } from '../ProjectDetailsPage'
import { Form } from 'antd'
import { ProjectTagName } from 'models/project-tags'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3_CURRENCY_USD } from 'packages/v2v3/utils/currency'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useForm } from 'antd/lib/form/Form'
import { useFormDispatchWatch } from '../../hooks/useFormDispatchWatch'
import { useWallet } from 'hooks/Wallet'

type ProjectDetailsFormProps = Partial<{
  projectName: string
  projectChainId: SupportedChainId
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
  const { projectChainId, projectMetadata, inputProjectOwner, mustStartAtOrAfter } =
    useAppSelector(state => state.creatingV2Project)

  const { chain } = useWallet() 

  const defaultChainId = chain?.id ? parseInt(chain.id) : DEFAULT_PROJECT_CHAIN_ID
  const initialValues: ProjectDetailsFormProps = useMemo(
    () => ({
      projectName: projectMetadata.name,
      projectChainId: projectChainId ?? defaultChainId,
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
      projectChainId,
      defaultChainId,
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
    dispatchFunction: creatingV2ProjectActions.setName,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectChainId',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setProjectChainId,
    formatter: v => v ?? DEFAULT_PROJECT_CHAIN_ID,
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTagline',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setProjectTagline,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDescription',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setDescription,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'tags',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setTags,
    formatter: v => v ?? [],
  })
  useFormDispatchWatch({
    form,
    fieldName: 'logo',
    dispatchFunction: creatingV2ProjectActions.setLogoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'coverImage',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setCoverImageUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectWebsite',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setInfoUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTwitter',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setTwitter,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectDiscord',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setDiscord,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'projectTelegram',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setTelegram,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'inputProjectOwner',
    ignoreUndefined: false,
    dispatchFunction: creatingV2ProjectActions.setInputProjectOwner,
    formatter: v => v,
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payButtonText',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setPayButton,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'payDisclosure',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setPayDisclosure,
    formatter: v => v ?? '',
  })

  useFormDispatchWatch({
    form,
    fieldName: 'introVideoUrl',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setIntroVideoUrl,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'introImageUri',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setIntroImageUri,
    formatter: v => v ?? '',
  })
  useFormDispatchWatch({
    form,
    fieldName: 'softTarget',
    ignoreUndefined: true,
    dispatchFunction: creatingV2ProjectActions.setSoftTarget,
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
        creatingV2ProjectActions.setMustStartAtOrAfter(
          (launchDate / 1000).toString(),
        ),
      )
    } else {
      dispatch(
        creatingV2ProjectActions.setMustStartAtOrAfter(launchDate.toString()),
      )
    }
  }, [dispatch, startTimestamp])

  return { form, initialValues }
}
