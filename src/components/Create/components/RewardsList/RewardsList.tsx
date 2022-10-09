import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Divider } from 'antd'
import { FormItemInput } from 'models/formItemInput'
import { useRewards } from './hooks'
import { RewardItem } from './RewardItem'
import { Reward } from './types'

export const RewardsList = ({ value, onChange }: FormItemInput<Reward[]>) => {
  const { rewards } = useRewards({ value, onChange })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {!!rewards.length && (
        <>
          {rewards.map(reward => (
            <>
              <RewardItem key={reward.id} {...reward} />
              <Divider style={{ margin: 0 }} />
            </>
          ))}
        </>
      )}
      <Button
        type="dashed"
        icon={<PlusCircleOutlined />}
        style={{
          height: '6rem',
          // TODO: Use proper imported colors
          backgroundColor: 'magenta',
          // backgroundColor: '#E8F5F7', // Light Theme/Primary/Blue Hint
        }}
      >
        Add NFT reward tier
      </Button>
    </div>
  )
}
