import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useMemo } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import {
  PayEventExtra,
  PayEventHeader,
  PayEventSubject,
} from './components/PayEvent'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { contentLineHeight, smallHeaderStyle } from '../styles'
import { ActivityElementEvent } from './activityElementEvent'
import { DeployedERC20EventHeader } from './components/DeployedERC20Event'
import { DeployedERC20EventSubject } from './components/DeployedERC20Event/DeployedERC20EventSubject'
import {
  DeployETHERC20ProjectPayerEventExtra,
  DeployETHERC20ProjectPayerEventHeader,
} from './components/DeployETHERC20ProjectPayerEvent'
import {
  DistributePayoutsEventExtra,
  DistributePayoutsEventHeader,
  DistributePayoutsEventSubject,
} from './components/DistributePayoutsEvent'
import {
  DistributeReservedTokensEventExtra,
  DistributeReservedTokensEventHeader,
  DistributeReservedTokensEventSubject,
} from './components/DistributeReservedTokensEvent'
import { ProjectCreateHeader } from './components/ProjectCreateEvent'
import { ProjectCreateSubject } from './components/ProjectCreateEvent/ProjectCreateSubject'
import { RedeemEventHeader } from './components/RedeemEvent'
import { RedeemEventExtra } from './components/RedeemEvent/RedeemEventExtra'
import { RedeemEventSubject } from './components/RedeemEvent/RedeemEventSubject'

const DetailsContainer: React.FC = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'space-between',
      }}
    >
      {children}
    </div>
  )
}

const ExtraContainer: React.FC = ({ children }) => {
  return (
    <div
      style={{
        marginTop: '5px',
      }}
    >
      {children}
    </div>
  )
}

function Header({ header }: { header: string | JSX.Element | null }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return <div style={smallHeaderStyle(colors)}>{header}</div>
}

function SideDetails({ details }: { details: Partial<ActivityElementEvent> }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div style={{ textAlign: 'right' }}>
      {details.timestamp && (
        <div style={smallHeaderStyle(colors)}>
          {formatHistoricalDate(details.timestamp * 1000)}{' '}
          <EtherscanLink value={details.txHash} type="tx" />
        </div>
      )}
      {details.beneficiary ? (
        <div
          style={{
            ...smallHeaderStyle(colors),
            lineHeight: contentLineHeight,
          }}
        >
          <FormattedAddress
            address={details.beneficiary}
            style={{ fontWeight: 400 }}
          />
        </div>
      ) : null}
    </div>
  )
}

function Subject({ subject }: { subject: string | JSX.Element | null }) {
  return (
    <div
      style={{
        lineHeight: contentLineHeight,
      }}
    >
      {subject}
    </div>
  )
}

function _ActivityEvent({
  header,
  subject,
  details,
  extra,
  style,
}: {
  header: string | JSX.Element | null
  subject: string | JSX.Element | null
  extra?: string | JSX.Element | null
  details: Partial<ActivityElementEvent>
  style?: CSSProperties
}) {
  return (
    <div style={style}>
      <DetailsContainer>
        <div>
          <Header header={header} />
          <Subject subject={subject} />
        </div>
        <SideDetails details={details} />
      </DetailsContainer>
      {extra ? <ExtraContainer>{extra}</ExtraContainer> : null}
    </div>
  )
}

export function ActivityEvent({
  event,
  style,
}: {
  event: ProjectEvent
  style?: CSSProperties
}) {
  // TODO: we should use v2 where we can, or a better context
  const { tokenSymbol } = useContext(V1ProjectContext)

  const { Header, Subject, Extra, details } = useMemo(() => {
    if (event.payEvent) {
      return {
        Header: PayEventHeader,
        Subject: <PayEventSubject amount={event.payEvent.amount} />,
        Extra: (
          <PayEventExtra
            feeFromV2Project={event.payEvent.feeFromV2Project ?? undefined}
            note={event.payEvent.note}
          />
        ),
        details: event.payEvent,
      }
    }
    if (event.redeemEvent) {
      return {
        Header: RedeemEventHeader,
        Subject: (
          <RedeemEventSubject
            amount={event.redeemEvent.amount}
            tokenSymbol={tokenSymbol}
          />
        ),
        Extra: (
          <RedeemEventExtra returnAmount={event.redeemEvent.returnAmount} />
        ),
        details: event.redeemEvent,
      }
    }
    if (event.projectCreateEvent) {
      return {
        Header: ProjectCreateHeader,
        Subject: (
          <ProjectCreateSubject caller={event.projectCreateEvent.caller} />
        ),
        Extra: null,
        details: event.projectCreateEvent,
      }
    }
    if (event.deployedERC20Event) {
      return {
        Header: DeployedERC20EventHeader,
        Subject: (
          <DeployedERC20EventSubject symbol={event.deployedERC20Event.symbol} />
        ),
        extra: null,
        details: event.deployedERC20Event,
      }
    }
    if (event.distributePayoutsEvent) {
      return {
        Header: DistributePayoutsEventHeader,
        Subject: (
          <DistributePayoutsEventSubject
            distributedAmount={event.distributePayoutsEvent.distributedAmount}
            id={event.distributePayoutsEvent.id}
          />
        ),
        Extra: (
          <DistributePayoutsEventExtra
            beneficiary={event.distributePayoutsEvent.beneficiary}
            beneficiaryDistributionAmount={
              event.distributePayoutsEvent.beneficiaryDistributionAmount
            }
            id={event.distributePayoutsEvent.id}
          />
        ),
        details: event.distributePayoutsEvent,
      }
    }
    if (event.distributeReservedTokensEvent) {
      return {
        Header: (
          <DistributeReservedTokensEventHeader tokenSymbol={tokenSymbol} />
        ),
        Subject: (
          <DistributeReservedTokensEventSubject
            id={event.distributeReservedTokensEvent.id}
            tokenCount={event.distributeReservedTokensEvent.tokenCount}
            tokenSymbol={tokenSymbol}
          />
        ),
        Extra: (
          <DistributeReservedTokensEventExtra
            beneficiary={event.distributeReservedTokensEvent.beneficiary}
            beneficiaryTokenCount={
              event.distributeReservedTokensEvent.beneficiaryTokenCount
            }
            id={event.distributeReservedTokensEvent.id}
          />
        ),
        details: event.distributeReservedTokensEvent,
      }
    }
    if (event.deployETHERC20ProjectPayerEvent) {
      return {
        Header: <DeployETHERC20ProjectPayerEventHeader />,
        Subject: null,
        Extra: (
          <DeployETHERC20ProjectPayerEventExtra
            address={event.deployETHERC20ProjectPayerEvent.address}
            memo={event.deployETHERC20ProjectPayerEvent.memo ?? undefined}
          />
        ),
        details: event.deployETHERC20ProjectPayerEvent,
      }
    }
    return { Header: null, Subject: null, Extra: null, details: null }
  }, [
    event.deployETHERC20ProjectPayerEvent,
    event.deployedERC20Event,
    event.distributePayoutsEvent,
    event.distributeReservedTokensEvent,
    event.payEvent,
    event.projectCreateEvent,
    event.redeemEvent,
    tokenSymbol,
  ])

  if (!Header && !Subject && !Extra && !details) return null

  return (
    <_ActivityEvent
      header={Header}
      subject={Subject}
      extra={Extra}
      details={details}
      style={style}
    />
  )
}
