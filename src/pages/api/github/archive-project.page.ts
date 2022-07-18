import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { CV } from 'models/cv'

import { readNetwork } from 'constants/networks'

interface ArchiveProjectNextApiRequest extends NextApiRequest {
  body: {
    archived: boolean
    projectId: number | undefined
    metadata: ProjectMetadataV4 | undefined
    handle: string | undefined
    cv: CV
  }
}

export const handler = async (
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

    const headers = {
      Authorization: `Bearer ${githubToken}`,
    }

    const title = `[${archived ? 'ARCHIVE' : 'UNARCHIVE'}] Project: "${
      metadata?.name
    }"`

    const body = `
  <b>Chain:</b> ${readNetwork.name}
  <b>Project ID:</b> ${projectId}
  ${handle ? `<b>Handle:</b> ${handle}` : ''}
  `

    const labels = [
      'archive request',
      cv === '2' ? 'V2' : 'V1',
      'bot',
      readNetwork.name === 'rinkeby' ? 'rinkeby' : undefined,
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
    console.error(error)
    return res.status(500)
  }
}
