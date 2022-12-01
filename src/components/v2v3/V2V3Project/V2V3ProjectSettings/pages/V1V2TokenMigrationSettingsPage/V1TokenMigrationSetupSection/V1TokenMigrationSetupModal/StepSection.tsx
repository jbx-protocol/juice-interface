import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { PropsWithChildren } from 'react'
import { classNames } from 'utils/classNames'

export function StepSection({
  children,
  completed,
  title,
}: PropsWithChildren<{ completed: boolean; title: string | JSX.Element }>) {
  return (
    <section>
      <h3
        className={classNames(
          completed
            ? 'text-grey-500 dark:text-grey-300'
            : 'text-juice-400 dark:text-juice-300',
        )}
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
