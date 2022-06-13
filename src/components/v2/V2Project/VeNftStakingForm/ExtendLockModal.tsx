import { Form, Modal, Select } from 'antd'
import { VeNftProjectContext } from 'contexts/v2/veNftProjectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext, useState } from 'react'
import { detailedTimeString } from 'utils/formatTime'
import { ThemeContext } from 'contexts/themeContext'
import { useExtendLockTx } from 'hooks/veNft/transactor/ExtendLockTx'
import { NetworkContext } from 'contexts/networkContext'
import { VeNftToken } from 'models/subgraph-entities/veNft/venft-token'

type ExtendLockModalProps = {
  visible: boolean
  token: VeNftToken
  onCancel: VoidFunction
}

const ExtendLockModal = ({
  visible,
  token,
  onCancel,
}: ExtendLockModalProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenId } = token
  const { lockDurationOptions } = useContext(VeNftProjectContext)
  const [updatedDuration, setUpdatedDuration] = useState(864000)
  const lockDurationOptionsInSeconds = lockDurationOptions
    ? lockDurationOptions.map((option: BigNumber) => {
        return option.toNumber()
      })
    : []
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const extendLockTx = useExtendLockTx()

  const extendLock = async () => {
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }
    const txSuccess = await extendLockTx({
      tokenId,
      updatedDuration,
    })

    if (!txSuccess) {
      return
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={extendLock}
      okText={`Extend Lock`}
    >
      <h2>Extend Lock</h2>
      <div style={{ color: colors.text.secondary }}>
        <p>Set an updated duration for your staking position.</p>
      </div>
      <Form layout="vertical" style={{ width: '100%' }}>
        <Form.Item>
          <Select
            value={updatedDuration}
            onChange={val => setUpdatedDuration(val)}
          >
            {lockDurationOptionsInSeconds.map((duration: number) => {
              return (
                <Select.Option key={duration} value={duration}>
                  {detailedTimeString({
                    timeSeconds: duration,
                    fullWords: true,
                  })}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ExtendLockModal
