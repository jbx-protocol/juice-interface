import * as admin from 'firebase-admin'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo/paginateDepleteProjectsQuery'
import { consolidateMetadata } from 'models/project-metadata'
import { NextApiRequest, NextApiResponse } from 'next'
import { firestoreAdmin } from 'utils/firebase/firebaseAdmin'
import { findProjectMetadata } from 'utils/server/ipfs'

interface ApiRequest extends NextApiRequest {
  body: {
    projectId: number
    cv: string
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  try {
    const { projectId, cv } = req.body
    const projects = await paginateDepleteProjectsQueryCall({
      variables: {
        where: { cv, projectId },
        first: 1,
      },
    })
    if (!projects.length) {
      return res.status(404).json({ message: 'Project not found' })
    }
    const metadata = await findProjectMetadata({
      metadataCid: projects[0].metadataUri!,
    })
    const { twitter } = consolidateMetadata(metadata)
    if (!twitter) {
      throw new Error(
        `Twitter handle not specified or unable to get project metadata.`,
      )
    }
    await firestoreAdmin.collection('twitterVerificationRequests').add({
      projectId,
      cv,
      twitter,
      verified: false,
      initiatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

export default handler
