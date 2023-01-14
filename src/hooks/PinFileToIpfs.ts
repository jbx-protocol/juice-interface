import { PinataMetadata } from '@pinata/sdk'
import axios from 'axios'
import { isWalletRegistered, registerWallet } from 'lib/api/ipfs'
import { useCallback } from 'react'
import { useWallet } from './Wallet'
import { v4 } from 'uuid'
import { WalletSigningRequestMessageTemplate } from 'utils/server/ipfs/pinata'

export const usePinFileToIpfs = () => {
  const wallet = useWallet()

  const loadCredsFromCache = useCallback(() => {
    const apiKey = localStorage.getItem('ipfsApiKey')
    const apiSecret = localStorage.getItem('ipfsApiSecret')
    if (apiKey && apiSecret) {
      return { apiKey, apiSecret }
    }
    return undefined
  }, [])

  const saveCredsToCache = useCallback((apiKey: string, apiSecret: string) => {
    localStorage.setItem('ipfsApiKey', apiKey)
    localStorage.setItem('ipfsApiSecret', apiSecret)
  }, [])

  const pinFileToIpfs = useCallback(
    async ({
      file,
      metadata,
      onProgress,
    }: {
      file: File | Blob | string
      metadata?: PinataMetadata
      onProgress: (percent: number) => void
    }) => {
      if (wallet.chainUnsupported) {
        await wallet.changeNetworks()
        return
      }
      if (!wallet.isConnected) {
        await wallet.connect()
        return
      }
      if (!wallet.userAddress) {
        throw new Error('Wallet is not connected')
      }
      const registered = await isWalletRegistered(wallet.userAddress)
      let creds = loadCredsFromCache()
      if (!registered || !creds) {
        if (!wallet.signer) throw new Error('Wallet is not connected')
        const nonce = v4()

        const signature = await wallet.signer.signMessage(
          WalletSigningRequestMessageTemplate({ nonce }),
        )
        const { apiKey, apiSecret } = await registerWallet(
          wallet.userAddress,
          signature,
          nonce,
        )
        saveCredsToCache(apiKey, apiSecret)
        creds = { apiKey, apiSecret }
      }

      const formData = new FormData()
      formData.append('file', file)
      if (metadata) {
        // TODO: we should make sure we only access strings, numbers, and dates
        if (metadata.name || metadata.keyvalues) {
          // metadata is configured correctly
          formData.append('pinataMetadata', JSON.stringify(metadata))
        }
        const metadataWrapper = {
          keyvalues: metadata,
        }
        formData.append('pinataMetadata', JSON.stringify(metadataWrapper))
      }

      const config = {
        maxBodyLength: Infinity,
        headers: {
          pinata_api_key: creds.apiKey,
          pinata_secret_api_key: creds.apiSecret,
          'Content-Type': `multipart/form-data; boundary=${
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (formData as any)._boundary
          }`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          )
          onProgress(percentCompleted)
        },
      }
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        config,
      )
      return res.data
    },

    [loadCredsFromCache, saveCredsToCache, wallet],
  )

  return pinFileToIpfs
}
