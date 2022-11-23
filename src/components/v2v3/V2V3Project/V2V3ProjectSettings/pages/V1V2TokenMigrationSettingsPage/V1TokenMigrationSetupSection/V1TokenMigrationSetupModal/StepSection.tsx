import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { JuiceTooltip } from 'components/JuiceTooltip'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'

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
          <JuiceTooltip title={<Trans>You've completed this step.</Trans>}>
            <CheckCircleFilled />
          </JuiceTooltip>
        )}
      </h3>

      {!completed ? children : null}
    </section>
  )
}
