import { Space } from 'antd'
import Loading from 'components/shared/Loading'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'

import { PayerReports } from './PayerReports'
import { PaymentActivity } from './PaymentActivity'
import { RedeemActivity } from './RedeemActivity'
import { TapActivity } from './TapActivity.tsx'

enum TabOption {
  pay = 'pay',
  redeem = 'redeem',
  payerReport = 'payerReport',
  tap = 'tap',
}

export default function ProjectActivity() {
  const { colors } = useContext(ThemeContext).theme
  const [initialized, setInitialized] = useState<boolean>()
  const [tabOption, setTabOption] = useState<TabOption>()
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [elemsCount, setElemsCount] = useState<number>()
  const [loading, setLoading] = useState<boolean>()

  const { projectId } = useContext(ProjectContext)

  const pageSize = 20

  useLayoutEffect(() => {
    if (initialized) return

    setInitialized(true)

    setTabOption(TabOption.pay)
  }, [initialized, setInitialized, setTabOption, projectId])

  const content = useMemo(() => {
    let content: JSX.Element | null = null

    switch (tabOption) {
      case TabOption.pay:
        content = (
          <PaymentActivity
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
      case TabOption.redeem:
        content = (
          <RedeemActivity
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
      case TabOption.payerReport:
        content = (
          <PayerReports
            pageNumber={pageNumber}
            pageSize={pageSize}
            setLoading={setLoading}
            setCount={setElemsCount}
          />
        )
        break
      case TabOption.tap:
        content = (
          <TapActivity
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
      case TabOption.pay:
        text = 'Payments'
        break
      case TabOption.redeem:
        text = 'Redeems'
        break
      case TabOption.tap:
        text = 'Withdrawals'
        break
      case TabOption.payerReport:
        text = 'Contributors'
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
    <div style={{ marginBottom: 20 }}>
      <Space size="middle">
        {tab(TabOption.pay)}
        {tab(TabOption.redeem)}
        {tab(TabOption.tap)}
        {tab(TabOption.payerReport)}
      </Space>
    </div>
  )

  return (
    <div>
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
