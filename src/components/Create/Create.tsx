import UserProvider from 'providers/UserProviderV1'

import Create from './Create'

export default function CreatePage() {
  return (
    <UserProvider>
      <Create />
    </UserProvider>
  )
}
