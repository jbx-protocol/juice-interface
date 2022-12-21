import axios from 'axios'
import { template } from 'lodash'

export const WalletSigningRequestMessageTemplate = template(
  'Sign this message to register your wallet to allow image uploads on Juicebox.\n\nYou may have to periodically sign for image upload.\n\nNo charges will be made against your wallet.\n\nRequest ID: ${nonce}',
)

interface PinataApiKey {
  name: string
  key: string
  secret: string
}
const PINATA_PINNER_KEY = process.env.PINATA_PINNER_KEY
const PINATA_PINNER_SECRET = process.env.PINATA_PINNER_SECRET

const Headers = {
  pinata_api_key: PINATA_PINNER_KEY,
  pinata_secret_api_key: PINATA_PINNER_SECRET,
}

export const requestPinataApiKeys = async (): Promise<
  Array<
    PinataApiKey & {
      max_uses: number | null
      uses: number
      createdAt: string
      revoked: boolean
    }
  >
> => {
  const config = {
    method: 'GET',
    url: 'https://api.pinata.cloud/users/apiKeys',
    headers: Headers,
  }
  return (await axios(config)).data.keys
}

export const revokeApiKey = async (apiKey: string): Promise<void> => {
  const config = {
    method: 'PUT',
    url: 'https://api.pinata.cloud/users/revokeApiKey',
    headers: Headers,
    data: { apiKey },
  }
  return (await axios(config)).data
}

export const registerApiKey = async (
  walletAddress: string,
): Promise<PinataApiKey> => {
  const data = {
    keyName: walletAddress,
    maxUses: 100,
    permissions: {
      endpoints: {
        data: {
          pinList: false,
          userPinnedDataTotal: false,
        },
        pinning: {
          hashMetadata: true,
          hashPinPolicy: false,
          pinByHash: true,
          pinFileToIPFS: true,
          pinJSONToIPFS: true,
          pinJobs: false,
          unpin: false,
          userPinPolicy: false,
        },
      },
    },
  }
  const config = {
    method: 'POST',
    url: 'https://api.pinata.cloud/users/generateApiKey',
    headers: Headers,
    data,
  }

  const result = (await axios(config)).data
  return {
    name: walletAddress,
    key: result.pinata_api_key,
    secret: result.pinata_api_secret,
  }
}
