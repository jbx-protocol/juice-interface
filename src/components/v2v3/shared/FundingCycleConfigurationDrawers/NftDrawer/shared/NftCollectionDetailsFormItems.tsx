import { t, Trans } from '@lingui/macro'
import { Form, Input, Radio } from 'antd'
import { Badge } from 'components/Badge'
import { Callout } from 'components/Callout'
import ExternalLink from 'components/ExternalLink'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { RadioItem } from 'components/RadioItem'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { JB721GovernanceType } from 'models/nftRewards'
import { useMemo } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { helpPagePath } from 'utils/routes'

export function NftCollectionDetailsFormItems({
  isReconfigure,
}: {
  isReconfigure?: boolean
}) {
  const showOnChainGoverance = useMemo(() => {
    // If not reconfiguring, always return true
    if (!isReconfigure) return true
    // Only show if feature flag is enabled
    return featureFlagEnabled(
      FEATURE_FLAGS.RECONFIGURE_SHOW_NFT_GOVERNANCE_TYPE,
    )
  }, [isReconfigure])
  return (
    <>
      <Form.Item name="collectionName" label={t`Collection name`} required>
        <Input type="string" autoComplete="off" />
      </Form.Item>
      {!isReconfigure ? (
        <Form.Item
          name="collectionSymbol"
          label={t`Collection symbol`}
          required
        >
          <Input type="string" autoComplete="off" />
        </Form.Item>
      ) : null}
      <Form.Item name="collectionDescription" label={t`Collection description`}>
        <Input type="string" autoComplete="off" />
      </Form.Item>

      {/* TODO: Remove this one feature flag is removed */}
      {showOnChainGoverance && (
        <MinimalCollapse header={<Trans>On-chain Governance</Trans>}>
          <div className="flex flex-col gap-6">
            {isReconfigure && (
              <Callout.Info
                className="bg-smoke-100 dark:bg-slate-500"
                transparent
              >
                Once deployed, on-chain governance cannot be changed
              </Callout.Info>
            )}
            <Form.Item name="onChainGovernance">
              <Radio.Group
                className="flex flex-col gap-5"
                disabled={isReconfigure}
                defaultValue={JB721GovernanceType.NONE}
              >
                <RadioItem
                  value={JB721GovernanceType.NONE}
                  title={
                    <div className="flex gap-2">
                      <Trans>No on-chain governance</Trans>{' '}
                      <span>
                        <Badge variant="info" upperCase>
                          <Trans>Default</Trans>
                        </Badge>
                      </span>
                    </div>
                  }
                  description={t`Your project's NFTs will not have on-chain governance capabilities.`}
                />
                <RadioItem
                  value={JB721GovernanceType.ONCHAIN}
                  title={t`Standard on-chain governance`}
                  description={
                    <Trans>
                      Track the historical voting weight of each token holder
                      across all tiers of NFTs.{' '}
                      <ExternalLink
                        href={helpPagePath(
                          '/user/configuration/#on-chain-governance',
                        )}
                      >
                        Learn more.
                      </ExternalLink>
                    </Trans>
                  }
                />
              </Radio.Group>
            </Form.Item>
          </div>
        </MinimalCollapse>
      )}
    </>
  )
}
