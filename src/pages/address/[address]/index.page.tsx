import { AddressDashboard } from 'components/AddressDashboard'
import { AppWrapper } from 'components/common'
import { useRouter } from 'next/router'

export default function AddressPage() {
  const router = useRouter()
  const { address } = router.query

  if (!address) return null

  return (
    <AppWrapper>
      <AddressDashboard address={address as string} />
    </AppWrapper>
  )
}
