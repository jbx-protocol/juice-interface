import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Button } from 'antd'
import axios from 'axios'
import { AppWrapper } from 'components/common'
import { useWallet } from 'hooks/Wallet'
import { v4 } from 'uuid'

export default function Foo() {
  const user = useUser()
  const wallet = useWallet()
  const supabaseClient = useSupabaseClient()

  const authenticate = async () => {
    if (!wallet.userAddress) {
      throw new Error('no wallet address')
    }
    const result = await axios.get(
      `/api/auth/challenge-message?walletAddress=${wallet.userAddress}`,
    )
    const challengeMessage: string = result.data.challengeMessage
    const signature = await wallet.signer?.signMessage(challengeMessage)

    const accessResult = await axios.post('/api/auth/wallet-sign-in', {
      walletAddress: wallet.userAddress,
      signature,
      message: challengeMessage,
    })
    const accessToken: string = accessResult.data.accessToken

    const { error } = await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: v4(), // garbage token, dont long live refresh token support refreshing
    })
    if (error) throw error
  }

  return (
    <AppWrapper>
      <div className="flex flex-col items-center">
        Authorized: {user ? <>🟢</> : <>🔴</>}
        {/* <Form
        onFinish={async values => {
          if (!values.email) throw new Error('no email')
          await signUp(values.email)
          // const password = v4()
          // const res = await supabaseClient.auth.signUp({
          //   email: values.email,
          //   password,
          // })
          // console.log(res)
        }}
      >
        <Form.Item name="email" label="Email">
          <JuiceInput />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form> */}
        {user ? (
          <>
            <Button
              onClick={() => {
                axios.post('/api/account/add-email', {
                  email: 'boo@bar.com',
                })
              }}
            >
              Email or some shit?
            </Button>
            <Button onClick={() => supabaseClient.auth.signOut()}>
              Sign out
            </Button>
          </>
        ) : (
          <div className="mt-4">
            <Button onClick={authenticate}>Sign in</Button>
          </div>
        )}
      </div>
    </AppWrapper>
  )
}
