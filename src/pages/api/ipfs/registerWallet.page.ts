import { recoverAddress } from '@ethersproject/transactions'
import { hashMessage } from '@ethersproject/hash'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  registerApiKey,
  requestPinataApiKeys,
  revokeApiKey,
  WalletSigningRequestMessageTemplate,
} from 'utils/server/ipfs/pinata'

const validateRequest = (req: NextApiRequest) => {
  const reqIsPost = req.method === 'POST'
  const reqBodyContainsWalletAddress = !!req.body.walletAddress
  const walletAddressIsString = typeof req.body.walletAddress === 'string'
  const reqBodyContainsSignature = !!req.body.signature
  const signatureIsString = typeof req.body.signature === 'string'
  const reqBodyContainsNonce = !!req.body.nonce
  const nonceIsString = typeof req.body.nonce === 'string'
  if (
    !reqIsPost ||
    !reqBodyContainsWalletAddress ||
    !walletAddressIsString ||
    !reqBodyContainsSignature ||
    !signatureIsString ||
    !reqBodyContainsNonce ||
    !nonceIsString
  ) {
    throw {
      error: 'Bad Request',
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    try {
      validateRequest(req)
    } catch (e) {
      return res.status(400).json(e)
    }
    const walletAddress = (req.body.walletAddress as string).toLowerCase()
    const signature = req.body.signature as string
    const nonce = req.body.nonce as string

    const signatureWalletAddress = recoverAddress(
      hashMessage(WalletSigningRequestMessageTemplate({ nonce })),
      signature,
    ).toLowerCase()

    if (signatureWalletAddress !== walletAddress) {
      return res.status(401).json({
        error: 'Unauthorized',
      })
    }

    const results = (await requestPinataApiKeys()).filter(
      r => r.name === walletAddress,
    )
    const revoked = await Promise.allSettled(
      results.map(async r => await revokeApiKey(r.key)),
    )
    revoked.forEach((r, i) => {
      if (r.status !== 'fulfilled') {
        console.error(`failed to revoke ${results[i].key}`)
      }
    })

    const registeredApiKey = await registerApiKey(walletAddress)

    return res.status(200).json({
      apiKey: registeredApiKey.key,
      apiSecret: registeredApiKey.secret,
    })
  } catch (e) {
    console.error('error occurred', e)
    return res.status(500).json({
      error: 'Error occurred',
    })
  }
}

export default handler
