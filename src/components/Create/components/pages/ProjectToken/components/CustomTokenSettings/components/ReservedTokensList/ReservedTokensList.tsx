import { DeleteOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import { Allocation } from 'components/Create/components/Allocation'
import { formatPercent } from 'components/Create/utils/formatPercent'
import FormattedAddress from 'components/FormattedAddress'
import { formatDate } from 'utils/format/formatDate'

export const ReservedTokensList = () => {
  {
    /* TODO: Fix modal to show correct data for allocations */
  }
  return (
    <Allocation>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Allocation.List addText={t`Add token allocation`}>
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
