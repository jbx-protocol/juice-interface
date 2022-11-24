import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import TooltipIcon from 'components/TooltipIcon'
import { default as useV1HandleForProjectId } from 'hooks/v1/contractReader/HandleForProjectId'

export function V1ProjectTokensDescriptionHeading({
  v1ProjectId,
}: {
  v1ProjectId: BigNumber | undefined
}) {
  const v1ProjectHandle = useV1HandleForProjectId(v1ProjectId)

  return (
    <Space size="small">
      <Trans>Your V1 balance</Trans>
      <TooltipIcon
        tip={
          <Trans>
            Your{' '}
            <a href={`/p/${v1ProjectHandle}`} target="_blank" rel="noreferrer">
              @{v1ProjectHandle}
            </a>{' '}
            V1 token balance.
          </Trans>
        }
      />
    </Space>
  )
}
