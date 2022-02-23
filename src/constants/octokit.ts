import { Octokit } from '@octokit/core'

export const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
})
