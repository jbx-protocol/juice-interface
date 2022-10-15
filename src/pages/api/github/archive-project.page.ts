import axios from 'axios'
import { CV } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { NextApiRequest, NextApiResponse } from 'next'

import { CV_V2, CV_V3 } from 'constants/cv'
import { readNetwork } from 'constants/networks'

interface ArchiveProjectNextApiRequest extends NextApiRequest {
  body: {
    archived: boolean
    projectId: number | undefined
    metadata: ProjectMetadataV5 | undefined
    handle: string | undefined
    cv: CV
  }
}

const handler = async (
  req: ArchiveProjectNextApiRequest,
  res: NextApiResponse,
) => {
  const githubToken = process.env.GITHUB_ACCESS_TOKEN
  if (!githubToken) {
    res.status(500).json({
      error: 'GITHUB_ACCESS_TOKEN is not set',
    })
    return
  }

  try {
    const { archived, projectId, metadata, handle, cv } = req.body

    if (!projectId || !metadata || !handle) {
      throw new Error()
    }

    const headers = {
      Authorization: `Bearer ${githubToken}`,
    }

    const title = `[${archived ? 'ARCHIVE' : 'UNARCHIVE'}] Project: "${
      metadata.name
    }"`

    const body = `
  <b>Chain:</b> ${readNetwork.name}
  <b>Project ID:</b> ${projectId}
  ${handle ? `<b>Handle:</b> ${handle}` : ''}
  `

    const labels = [
      'archive request',
      cv === CV_V3 ? 'V3' : cv === CV_V2 ? 'V2' : 'V1',
      'bot',
      readNetwork.name === 'goerli' ? 'goerli' : undefined,
      readNetwork.name === 'mainnet' ? 'mainnet' : undefined,
    ].filter(Boolean)

    const data = {
      title,
      body,
      labels,
    }

    const response = await axios.post(
      'https://api.github.com/repos/jbx-protocol/juice-interface/issues',
      data,
      {
        headers,
      },
    )

    res.status(200).json({
      response,
    })
  } catch (error) {
    return res.status(500)
  }
}

export default handler
