import axios from 'axios'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { CV } from 'models/cv'

import { readNetwork } from 'constants/networks'

export const postGitHubIssueForArchive = ({
  archived,
  projectId,
  metadata,
  handle,
  cv,
}: {
  archived: boolean
  projectId: number | undefined
  metadata: ProjectMetadataV4 | undefined
  handle: string | undefined
  cv: CV
}) => {
  const body = `
  <b>Chain:</b> ${readNetwork.name}
  <b>Project ID:</b> ${projectId}
  ${handle ? `<b>Handle:</b> ${handle}` : ''}
  `

  axios.post(
    'https://api.github.com/repos/jbx-protocol/juice-interface/issues',
    {
      title: `[${archived ? 'ARCHIVE' : 'UNARCHIVE'}] Project: "${
        metadata?.name
      }"`,
      body,
      labels: [
        'archive request',
        cv === '2' ? 'V2' : 'V1',
        'bot',
        readNetwork.name === 'rinkeby' ? 'rinkeby' : undefined,
        readNetwork.name === 'mainnet' ? 'mainnet' : undefined,
      ].filter(Boolean),
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
      },
    },
  )
}
