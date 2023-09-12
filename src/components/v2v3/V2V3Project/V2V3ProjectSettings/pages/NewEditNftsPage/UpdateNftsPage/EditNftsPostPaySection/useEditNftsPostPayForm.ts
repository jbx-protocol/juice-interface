import { Form } from 'antd'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContext } from 'react'

export interface EditNftsPostPayFormFields {
  postPayMessage: string | undefined
  postPayButtonText: string | undefined
  postPayButtonLink: string | undefined
}

export const useEditNftsPostPayForm = () => {
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const [form] = Form.useForm<EditNftsPostPayFormFields>()

  const initialValues: EditNftsPostPayFormFields = {
    postPayMessage: projectMetadata?.nftPaymentSuccessModal?.content,
    postPayButtonText: projectMetadata?.nftPaymentSuccessModal?.ctaText,
    postPayButtonLink: projectMetadata?.nftPaymentSuccessModal?.ctaLink,
  }
  return {
    form,
    initialValues,
  }
}
