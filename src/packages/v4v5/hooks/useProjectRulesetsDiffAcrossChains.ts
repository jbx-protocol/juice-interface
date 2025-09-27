import { JBChainId, JBRulesetData, JBRulesetMetadata } from "juice-sdk-core";
import { useJBContractContext, useSuckers } from "juice-sdk-react";


export function useProjectRulesetsDiffAcrossChains(type: 'upcoming' | 'current') {
  const { data: suckers } = useSuckers()
  const { projectId, contracts } = useJBContractContext()

  const currentRulesetsAndMetadataByChain = {
    // 1234: {
    //    ruleset: JBRulesetData
    //    metadata: JBRulesetMetadata
    // },
    // etc.
  } as Record<JBChainId, JBRulesetData & JBRulesetMetadata>
  const upcomingRulesetsAndMetadataByChain = {
    // 1234: {
    //    ruleset: JBRulesetData
    //    metadata: JBRulesetMetadata
    // },
    // etc.
  }
  // suckers?.forEach((suckerPair) => {
  //   const { data: currentRuleset, isLoading: currentLoading } = useJBRuleset(suckerPair.chainId)
  //   const { data: upcomingRuleset, isLoading: upcomingLoading } = useJBUpcomingRuleset(suckerPair.peerChainId as JBChainId)
  //   // how to fill currentRulesetsAndMetadataByChain and upcomingRulesetsAndMetadataByChain?
  // })

  // if (type === 'upcoming') {
  //   return { 
  //     data: getDiffedAttrBetweenRulesets(upcomingRulesetsAndMetadataByChain), 
  //     isLoading 
  //   }
  // }

  // return {
  //   data: getDiffedAttrBetweenRulesets(currentRulesetsAndMetadataByChain),
  //   isLoading
  // }
}
