import { Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { PayProjectModalFormValues } from 'components/ProjectDashboard/hooks/usePayProjectModal'
import { useFiatCheckoutURL } from 'components/ProjectDashboard/hooks/usePayProjectModal/useFiatCheckoutURL'
import { JuiceModal } from 'components/modals/JuiceModal'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useFormikContext } from 'formik'
import useWeiConverter from 'hooks/useWeiConverter'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

export default function FiatCheckout() {
  const { totalAmount } = useProjectCart()
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)
  const [open, setOpen] = useState<boolean>(false)

  const router = useRouter()

  const weiAmount = useWeiConverter({
    amount: totalAmount?.amount.toString(),
    currency: totalAmount?.currency,
  })

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}?fiatCheckout=complete`

  const { values } = useFormikContext<PayProjectModalFormValues>()

  const checkoutUrl = useFiatCheckoutURL({
    name: projectMetadata?.name,
    projectId,
    amount: weiAmount,
    logoUri: projectMetadata?.logoUri,
    memo:
      [values.message.messageString, values.message.attachedUrl]
        .filter(m => m)
        .join('\n\n') ?? '',
    receiverId: values.beneficiaryAddress, // TODO
    // paymentAddress: '0xe2b50886b7D90dE894Ba4B894839eacCbdede1d3', // TODO
    metadata:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f8b169f800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000',
    redirectUrl,
  })

  if (!checkoutUrl) return null

  return (
    <>
      <Button
        disabled={!values.userAcceptsTerms}
        className="w-full"
        onClick={() => {
          setOpen(true)
        }}
      >
        <Trans>Pay with Fiat</Trans>
      </Button>

      <JuiceModal
        className="w-full max-w-2xl"
        open={open}
        setOpen={setOpen}
        okButtonClassName="hidden"
      >
        <iframe className="h-144 w-full" src={checkoutUrl} />

        <Divider />
      </JuiceModal>
    </>
  )
}
