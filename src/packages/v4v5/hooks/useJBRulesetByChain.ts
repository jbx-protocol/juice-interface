import {
  JBChainId
} from 'juice-sdk-core'
import {
  useJBProjectId,
  useJBRuleset
} from 'juice-sdk-react'

export function useJBRulesetByChain(chainId: JBChainId | undefined) {
  const { projectId } = useJBProjectId(chainId)
  return useJBRuleset({
    projectId,
    chainId,
  })
}
