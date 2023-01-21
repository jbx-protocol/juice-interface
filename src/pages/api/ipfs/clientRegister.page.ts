import { FEATURE_FLAGS } from 'constants/featureFlags'
import { NextApiRequest, NextApiResponse } from 'next'
import { featureFlagEnabled } from 'utils/featureFlags'
import { registerApiKey } from 'utils/server/ipfs/pinata'
import { v4 } from 'uuid'

const validateRequest = (req: NextApiRequest) => {
  const reqIsPost = req.method === 'POST'
  if (!reqIsPost) {
    throw {
      error: 'Bad Request',
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (featureFlagEnabled(FEATURE_FLAGS.IPFS_REQUIRES_KEY_REGISTRATION)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    try {
      validateRequest(req)
    } catch (e) {
      return res.status(400).json(e)
    }

    const registeredApiKey = await registerApiKey(v4(), 10)

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
