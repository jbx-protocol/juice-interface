import { NextApiRequest, NextApiResponse } from 'next'
import { firestoreAdmin } from 'utils/firebase/firebaseAdmin'
import { verifySignature } from 'utils/signature'

interface ApiRequest extends NextApiRequest {
  body: {
    signer: string
    message: string
    signature: string
    projectId: number
    cv: string
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  const { signer, message, signature, projectId, cv } = req.body
  try {
    const isValidSignature = verifySignature(signer, message, signature)
    if (!isValidSignature) {
      return res.status(401).json({ message: 'Invalid signature' })
    }
    await firestoreAdmin
      .collection('twitterVerification')
      .doc(`${cv}-${projectId}`)
      .delete()
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export default handler
