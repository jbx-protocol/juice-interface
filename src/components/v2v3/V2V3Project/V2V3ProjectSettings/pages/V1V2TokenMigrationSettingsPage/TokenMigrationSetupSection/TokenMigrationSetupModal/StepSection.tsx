import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { PropsWithChildren } from 'react'

export function StepSection({
  children,
  completed,
  title,
}: PropsWithChildren<{ completed: boolean; title: string | JSX.Element }>) {
  return (
    <section>
      <h3 className="text-black dark:text-slate-100">
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
