import { Space } from 'antd'
import { t } from '@lingui/macro'

import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'

import SectionHeader from '../SectionHeader'
import { PaymentActivity } from './PaymentActivity'
import { RedeemActivity } from './RedeemActivity'
import { ReservesActivity } from './ReservesActivity'
import { TapActivity } from './TapActivity'

type TabOption = 'pay' | 'redeem' | 'tap' | 'reserves'

export default function ProjectActivity() {
  const { colors } = useContext(ThemeContext).theme
  const [initialized, setInitialized] = useState<boolean>()
  const [tabOption, setTabOption] = useState<TabOption>()

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
        content = <PaymentActivity pageSize={pageSize} />
        break
      case 'redeem':
        content = <RedeemActivity pageSize={pageSize} />
        break
      case 'tap':
        content = <TapActivity pageSize={pageSize} />
        break
      case 'reserves':
        content = <ReservesActivity pageSize={pageSize} />
        break
    }

    return content
  }, [tabOption, pageSize])

  const tab = (tab: TabOption) => {
    const selected = tab === tabOption

    let text: string
    switch (tab) {
      case 'pay':
        text = t`Pay`
        break
      case 'redeem':
        text = t`Redeem`
        break
      case 'tap':
        text = t`Withdraw`
        break
      case 'reserves':
        text = t`Reserves`
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
      </Space>
    </div>
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <SectionHeader text={t`Activity`} />
        {tabs}
      </div>

      {content}
    </div>
  )
}
