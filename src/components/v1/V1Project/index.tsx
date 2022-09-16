import { LoadingOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { CSSProperties, useContext, useState } from 'react'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

import PayInputGroup from 'components/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/Project/ProjectHeader'
import { CurrencyContext } from 'contexts/currencyContext'
import { CurrencyOption } from 'models/currencyOption'
import { lazy, Suspense } from 'react'

import { weightedRate } from 'utils/v1/math'

import { CV_V1 } from 'constants/cv'
import FundingCycles from './FundingCycles'
import Paid from './Paid'
import ProjectActivity from './ProjectActivity'
import Rewards from './Rewards'
import V1PayButton from './V1PayButton'
import V1ProjectHeaderActions from './V1ProjectHeaderActions'

const VolumeChart = lazy(() => import('components/VolumeChart'))

const gutter = 40

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
  } = useContext(V1ProjectContext)

  const {
    currencies: { ETH },
  } = useContext(CurrencyContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<CurrencyOption>(ETH)

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)
  const reservedRate = fcMetadata?.reservedRate

  if (projectId === undefined || !fcMetadata) return null

  return (
    <div style={style}>
      <ProjectHeader
        metadata={metadata}
        handle={handle}
        isArchived={isArchived}
        projectOwnerAddress={owner}
        actions={<V1ProjectHeaderActions />}
        projectId={projectId}
      />

      <Row gutter={gutter} align="bottom">
        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <Paid />
        </Col>

        <Col xs={24} md={column ? 24 : 12} style={{ marginTop: gutter }}>
          <PayInputGroup
            payAmountETH={payAmount}
            onPayAmountChange={setPayAmount}
            payInCurrency={payInCurrency}
            onPayInCurrencyChange={setPayInCurrency}
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
                  cv={CV_V1}
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
