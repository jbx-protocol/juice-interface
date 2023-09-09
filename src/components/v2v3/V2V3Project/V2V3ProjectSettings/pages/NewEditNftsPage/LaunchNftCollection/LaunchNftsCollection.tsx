import { AddNftCollectionForm } from 'components/Create/components'
import { UploadAndLaunchNftsButton } from './UploadAndLaunchNftsButton'

export function LaunchNftsPage() {
  return (
    <AddNftCollectionForm
      okButton={<UploadAndLaunchNftsButton className="mt-10" />}
    />
  )
}
