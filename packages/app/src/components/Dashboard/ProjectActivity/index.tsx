import { Space } from 'antd'
import Loading from 'components/shared/Loading'
import { ThemeOption } from 'constants/theme/theme-option'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import SectionHeader from '../SectionHeader'

import { PayerReports } from './PayerReports'
import { PaymentActivity } from './PaymentActivity'
import { RedeemActivity } from './RedeemActivity'
import { ReservesActivity } from './ReservesActivity'
import { TapActivity } from './TapActivity'

type TabOption = 'pay' | 'redeem' | 'payerReport' | 'tap' | 'reserves'

export default function ProjectActivity() {
  const { colors } = useContext(ThemeContext).theme
  const [initialized, setInitialized] = useState<boolean>()
  const [tabOption, setTabOption] = useState<TabOption>()
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [elemsCount, setElemsCount] = useState<number>()
  const [loading, setLoading] = useState<boolean>()

  const { projectId } = useContext(ProjectContext)

  const pageSize = 50

  useLayoutEffect(() => {
    if (initialized) return

    setInitialized(true)

    setTabOption('pay')
  }, [initialized, setInitialized, setTabOption, projectId])

  const content = useMemo(() => {
    let content: JSX.Element | null = null

    switch (tabOption) {
      case 'pay':
        content = (
          <PaymentActivity
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
      case 'redeem':
        content = (
          <RedeemActivity
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
      case 'payerReport':
        content = (
          <PayerReports
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
      case 'tap':
        content = (
          <TapActivity
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
      case 'reserves':
        content = (
          <ReservesActivity
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
    }

    return content
  }, [tabOption, pageNumber, pageSize, setLoading, setElemsCount])

  const tab = (tab: TabOption) => {
    const selected = tab === tabOption

    let text: string
    switch (tab) {
      case 'pay':
        text = 'Pay'
        break
      case 'redeem':
        text = 'Redeem'
        break
      case 'tap':
        text = 'Withdraw'
        break
      case 'reserves':
        text = 'Reserves'
        break
      case 'payerReport':
        text = 'Payers'
        break
    }

    return (
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          fontWeight: selected ? 600 : 400,
          color: selected ? colors.text.secondary : colors.text.tertiary,
          cursor: 'pointer',
        }}
        onClick={() => {
          setPageNumber(0)
          setTabOption(tab)
        }}
      >
        {text}
      </div>
    )
  }

  const tabs = (
    <div style={{ marginBottom: 20, maxWidth: '100%', overflow: 'auto' }}>
      <Space size="middle">
        {tab('pay')}
        {tab('redeem')}
        {tab('tap')}
        {tab('reserves')}
        {tab('payerReport')}
      </Space>
    </div>
  )

  return (
    <div>
      <SectionHeader text="Activity" />
      {tabs}

      <div style={{ paddingBottom: 40 }}>
        {content}

        {elemsCount === 0 && (
          <div
            style={{
              color: colors.text.secondary,
              paddingTop: 20,
              borderTop: '1px solid ' + colors.stroke.tertiary,
            }}
          >
            No activity yet
          </div>
        )}

        {loading && (
          <div>
            <Loading />
          </div>
        )}

        {elemsCount && elemsCount % pageSize === 0 && !loading ? (
          <div
            style={{
              textAlign: 'center',
              color: colors.text.secondary,
              cursor: 'pointer',
            }}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Load more
          </div>
        ) : loading ? null : (
          <div
            style={{
              textAlign: 'center',
              padding: 10,
              color: colors.text.secondary,
            }}
          >
            {elemsCount} total
          </div>
        )}
      </div>
    </div>
  )
}
