import { PinataMetadata } from '@pinata/sdk'
import axios from 'axios'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import {
  clientRegister,
  isWalletRegistered,
  registerWallet,
} from 'lib/api/ipfs'
import { useCallback } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { WalletSigningRequestMessageTemplate } from 'utils/server/ipfs/pinata'
import { v4 } from 'uuid'
import { useWallet } from './Wallet'

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

  const walletCredStrategy = useCallback(
    async (forceFlush: boolean) => {
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
      if (!registered || !creds || forceFlush) {
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
      return creds
    },
    [loadCredsFromCache, saveCredsToCache, wallet],
  )

  const anyCredStrategy = useCallback(
    async (forceFlush: boolean) => {
      let creds = loadCredsFromCache()
      if (!creds || forceFlush) {
        const { apiKey, apiSecret } = await clientRegister()
        saveCredsToCache(apiKey, apiSecret)
        creds = { apiKey, apiSecret }
      }

      return creds
    },
    [loadCredsFromCache, saveCredsToCache],
  )

  const getCreds = useCallback(
    async (forceFlush?: boolean) => {
      if (featureFlagEnabled(FEATURE_FLAGS.IPFS_REQUIRES_KEY_REGISTRATION)) {
        return await walletCredStrategy(!!forceFlush)
      } else {
        return await anyCredStrategy(!!forceFlush)
      }
    },
    [anyCredStrategy, walletCredStrategy],
  )

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
      let creds = await getCreds()
      if (!creds) return

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

      let retries = 0
      while (retries < 2) {
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
        try {
          const res = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            config,
          )
          return res.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          if (e.response.status !== 403) {
            throw e
          }
          creds = await getCreds(true)
          if (!creds) return
          retries++
        }
      }
    },

    [getCreds],
  )

  return pinFileToIpfs
}
