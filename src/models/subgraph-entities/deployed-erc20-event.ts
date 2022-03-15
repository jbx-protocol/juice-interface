import { parseProjectJson } from 'models/subgraph-entities/project'

import { Project, ProjectJson } from './project'

export interface DeployedERC20Event {
  id: string
  project: Partial<Project>
  symbol: string
  timestamp: number
  txHash: string
}

export type DeployedERC20EventJson = Partial<
  Record<Exclude<keyof DeployedERC20Event, 'project'>, string> & {
    project: ProjectJson
    timestamp: number
  }
>

export const parseDeployedERC20EventJson = (
  json: DeployedERC20EventJson,
): Partial<DeployedERC20Event> => ({
  ...json,
  project: json.project ? parseProjectJson(json.project) : undefined,
})
