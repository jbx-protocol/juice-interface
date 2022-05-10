import axios from 'axios'

import { ProjectMetadataV4 } from 'models/project-metadata'

import { BigNumber } from '@ethersproject/bignumber'

import { readNetwork } from 'constants/networks'

export const postGitHubIssueForArchive = ({
  archived,
  projectId,
  metadata,
  handle,
}: {
  archived: boolean
  projectId: BigNumber | undefined
  metadata: ProjectMetadataV4 | undefined
  handle: string | undefined
}) =>
  axios.post(
    'https://api.github.com/repos/jbx-protocol/juice-interface/issues',
    {
      title: `[${archived ? 'ARCHIVE' : 'UNARCHIVE'}] Project: "${
        metadata?.name
      }"`,
      body: `<b>Chain:</b> ${
        readNetwork.name
      } \n <b>Project ID:</b> ${projectId}${
        handle ? `\n <b>Handle:</b> ${handle}` : ''
      }`,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
      },
    },
  )
