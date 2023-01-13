import { NextApiRequest, NextApiResponse } from 'next'
import { requestPinataApiKeys } from 'utils/server/ipfs/pinata'

const validateRequest = (req: NextApiRequest) => {
  const reqIsPost = req.method === 'POST'
  const reqBodyContainsWalletAddress = !!req.body.walletAddress
  const walletAddressIsString = typeof req.body.walletAddress === 'string'
  if (!reqIsPost || !reqBodyContainsWalletAddress || !walletAddressIsString) {
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

    const result = await requestPinataApiKeys()

    const registeredWallet = result.find(key => key.name === walletAddress)
    if (!registeredWallet || registeredWallet.revoked) {
      return res.status(200).json({
        registered: false,
      })
    }

    if (
      registeredWallet.max_uses !== null &&
      registeredWallet.uses >= registeredWallet.max_uses
    ) {
      return res.status(200).json({
        registered: false,
      })
    }

    const createdAt = new Date(registeredWallet.createdAt)
    const now = new Date()
    const oneDay = 1000 * 60 * 60 * 24
    if (now.getTime() - createdAt.getTime() > oneDay) {
      return res.status(200).json({
        registered: false,
      })
    }

    return res.status(200).json({
      registered: true,
    })
  } catch (e) {
    console.error('error occurred', e)
    return res.status(500).json({
      error: 'Error occurred',
    })
  }
}

export default handler
