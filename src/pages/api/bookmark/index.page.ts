import { CV } from 'models/cv'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  bookmarkProject,
  unbookmarkProject,
} from 'utils/db/firebase/queries/bookmarkProject'

export interface BookmarkProjectData {
  address: string
  projectId: number
  cv: CV
  shouldUnbookmark?: boolean
}

interface BookmarkProjectRequest extends NextApiRequest {
  body: BookmarkProjectData
}

const handler = async (req: BookmarkProjectRequest, res: NextApiResponse) => {
  const { address, projectId, cv, shouldUnbookmark } = req.body
  try {
    if (!address || !projectId || !cv) {
      throw new Error('Missing required fields')
    }
    if (shouldUnbookmark) {
      try {
        await unbookmarkProject(address, projectId, cv)
      } catch (err) {
        throw new Error('Error removing bookmark')
      }
    } else {
      try {
        bookmarkProject(address, projectId, cv)
      } catch (err) {
        throw new Error('Error bookmarking project')
      }
    }
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export default handler
