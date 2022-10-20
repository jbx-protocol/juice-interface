import { DeleteOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import {
  Allocation,
  AllocationSplit,
} from 'components/Create/components/Allocation'
import { OwnerPayoutCard } from 'components/Create/components/PayoutCard'
import { formatPercent } from 'components/Create/utils/formatPercent'
import FormattedAddress from 'components/FormattedAddress'
import { FormItemInput } from 'models/formItemInput'
import { formatDate } from 'utils/format/formatDate'

export const ReservedTokensList: React.FC<
  FormItemInput<AllocationSplit[]> & { isEditable?: boolean }
> = ({ isEditable, value, onChange }) => {
  return (
    <Allocation value={value} onChange={onChange}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <OwnerPayoutCard payoutsSelection={'percentages'} />
        <Allocation.List
          availableModes={new Set(['percentage'])}
          addText={t`Add token allocation`}
          isEditable={isEditable}
        >
          {(
            modal,
            { allocations, removeAllocation, setSelectedAllocation },
          ) => (
            <>
              {allocations.map(allocation => (
                <Allocation.Item
                  key={allocation.id}
                  title={
                    <Space>
                      <FormattedAddress address={allocation.beneficiary} />
                      {!!allocation.lockedUntil && (
                        <Tooltip
                          title={t`Locked until ${formatDate(
                            allocation.lockedUntil * 1000,
                            'yyyy-MM-DD',
                          )}`}
                        />
                      )}
                    </Space>
                  }
                  amount={formatPercent(allocation.percent)}
                  extra={
                    <DeleteOutlined
                      onClick={e => {
                        e.stopPropagation()
                        removeAllocation(allocation.id)
                      }}
                    />
                  }
                  onClick={() => {
                    setSelectedAllocation(allocation)
                    modal.open()
                  }}
                />
              ))}
            </>
          )}
        </Allocation.List>
      </Space>
    </Allocation>
  )
}
