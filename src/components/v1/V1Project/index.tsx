import { Col, Row } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { CSSProperties, useContext, useState } from 'react'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

import ProjectHeader from 'components/Project/ProjectHeader'
import PayInputGroup from 'components/inputs/Pay/PayInputGroup'

import { Suspense, lazy } from 'react'

import { weightedRate } from 'utils/math'

import FundingCycles from './FundingCycles'
import Paid from './Paid'
import ProjectActivity from './ProjectActivity'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'
import Rewards from './Rewards'
import V1PayButton from './V1PayButton'

const VolumeChart = lazy(() => import('components/VolumeChart'))

export default function V1Project({
  style,
  showCurrentDetail,
  column,
}: {
  style?: CSSProperties
  showCurrentDetail?: boolean
  column?: boolean
}) {
  const {
    createdAt,
    currentFC,
    projectId,
    handle,
    metadata,
    isArchived,
    tokenSymbol,
    tokenAddress,
    isPreviewMode,
    owner,
    cv,
  } = useContext(V1ProjectContext)

  const [payAmount, setPayAmount] = useState<string>('0')

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)
  const reservedRate = fcMetadata?.reservedRate

  const gutter = 40

  if (projectId === undefined || !fcMetadata) return null

  return (
    <div style={style}>
      <ProjectHeader
        metadata={metadata}
        handle={handle}
        isArchived={isArchived}
        owner={owner}
        actions={<V1ProjectHeaderActions />}
      />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Paid />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <PayInputGroup
            payAmountETH={payAmount}
            onChange={setPayAmount}
            PayButton={V1PayButton}
            reservedRate={reservedRate}
            weight={currentFC?.weight}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            weightingFn={weightedRate}
          />
        </Col>
      </Row>

      <Row gutter={gutter} style={{ paddingBottom: gutter }}>
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          {projectId && (
            <div style={{ marginBottom: gutter }}>
              <Suspense fallback={<LoadingOutlined />}>
                <VolumeChart
                  style={{ height: 240 }}
                  projectId={projectId}
                  createdAt={createdAt}
                  cv={cv ?? '1'}
                />
              </Suspense>
            </div>
          )}

          <div style={{ marginBottom: gutter }}>
            <Rewards />
          </div>

          <FundingCycles showCurrentDetail={showCurrentDetail} />
        </Col>
        {!isPreviewMode ? (
          <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
            <ProjectActivity />
          </Col>
        ) : null}
      </Row>
    </div>
  )
}
