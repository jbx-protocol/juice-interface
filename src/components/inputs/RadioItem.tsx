import { Radio } from 'antd'
import { JB721GovernanceType } from 'models/nftRewards'
import { ReactNode } from 'react'

export const RadioItem = ({
  value,
  title,
  description,
}: {
  value: JB721GovernanceType
  title?: ReactNode
  description?: ReactNode
}) => {
  return (
    <Radio value={value}>
      <span className="text-sm">
        {title && <div className="font-medium">{title}</div>}
        {description && (
          <div className="mt-1 font-normal text-grey-500 dark:text-grey-300">
            {description}
          </div>
        )}
      </span>
    </Radio>
  )
}
