import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'
import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'

export function StepSection({
  children,
  completed,
  title,
}: PropsWithChildren<{ completed: boolean; title: string | JSX.Element }>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <section>
      <h3
        style={{
          color: completed ? colors.text.secondary : colors.text.brand.primary,
        }}
      >
        {title}{' '}
        {completed && (
          <Tooltip title={<Trans>You've completed this step.</Trans>}>
            <CheckCircleFilled />
          </Tooltip>
        )}
      </h3>

      {!completed ? children : null}
    </section>
  )
}
