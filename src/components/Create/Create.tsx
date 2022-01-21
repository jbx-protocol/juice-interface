import UserProviderV2 from 'providers/UserProviderV2'

import Create from './Create'

export default function CreatePage() {
  return (
    <UserProviderV2>
      <Create />
    </UserProviderV2>
  )
}
