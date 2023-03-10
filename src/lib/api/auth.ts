import axios from 'axios'

export const AuthAPI = {
  getChallengeMessage: async ({
    wallet,
  }: {
    wallet: string
  }): Promise<string> => {
    const result = await axios.get(
      `/api/auth/challenge-message?walletAddress=${wallet}`,
    )
    if (!result.data.challengeMessage)
      throw new Error('No challenge message received')
    return result.data.challengeMessage
  },
  walletSignIn: async ({
    wallet: walletAddress,
    message,
    signature,
  }: {
    wallet: string
    signature: string
    message: string
  }): Promise<string> => {
    const result = await axios.post('/api/auth/wallet-sign-in', {
      walletAddress,
      signature,
      message,
    })
    if (!result.data.accessToken) throw new Error('No access token received')
    return result.data.accessToken
  },
}
