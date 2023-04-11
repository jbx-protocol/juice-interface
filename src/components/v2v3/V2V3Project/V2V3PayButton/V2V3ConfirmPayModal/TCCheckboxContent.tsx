import { Trans } from '@lingui/macro'
import { Modal } from 'antd'
import ExternalLink from 'components/ExternalLink'
import ProjectRiskNotice from 'components/ProjectRiskNotice'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext, useState } from 'react'
import { helpPagePath } from 'utils/routes'
import {
  getUnsafeV2V3FundingCycleProperties,
  getV2V3FundingCycleRiskCount,
} from 'utils/v2v3/fundingCycle'

export function TCCheckboxContent() {
  const { fundingCycle, fundingCycleMetadata } = useContext(V2V3ProjectContext)

  const [riskModalVisible, setRiskModalVisible] = useState<boolean>()
  const riskCount =
    fundingCycle && fundingCycleMetadata
      ? getV2V3FundingCycleRiskCount(fundingCycle, fundingCycleMetadata)
      : undefined

  return (
    <>
      <span className="font-normal">
        {riskCount ? (
          <Trans>
            I understand and accept the risks associated with{' '}
            <a
              onClick={e => {
                setRiskModalVisible(true)
                e.preventDefault()
              }}
            >
              this project
            </a>{' '}
            and the{' '}
            <ExternalLink href={helpPagePath('/dev/learn/risks')}>
              Juicebox Protocol
            </ExternalLink>
            .
          </Trans>
        ) : (
          <Trans>
            I accept the{' '}
            <ExternalLink href={helpPagePath('/dev/learn/risks')}>
              risks
            </ExternalLink>{' '}
            associated with the Juicebox protocol.
          </Trans>
        )}
      </span>

      <Modal
        title={<Trans>Potential risks</Trans>}
        open={riskModalVisible}
        okButtonProps={{ hidden: true }}
        onCancel={() => setRiskModalVisible(false)}
        cancelText={<Trans>Close</Trans>}
      >
        {fundingCycle && fundingCycleMetadata && (
          <ProjectRiskNotice
            unsafeProperties={getUnsafeV2V3FundingCycleProperties(
              fundingCycle,
              fundingCycleMetadata,
            )}
          />
        )}
      </Modal>
    </>
  )
}
