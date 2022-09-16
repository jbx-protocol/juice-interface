import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { VeNftVariant } from 'models/veNft'
import { useState } from 'react'

import { MinimalCollapse } from 'components/MinimalCollapse'
import VeNftRewardTierModal from 'components/veNft/VeNftRewardTierModal'
import VeNftvariantCard from 'components/veNft/VeNftVariantCard'

import { DEFAULT_LOCK_DURATIONS } from 'constants/veNft/veNftProject'
import VeNftAddLockDurationModal from './VeNftAddLockDurationModal'
import VeNftLockDurationOptionCard from './VeNftLockDurationOptionCard'

interface VeNftSetupModalProps {
  visible: boolean
  onCancel: VoidFunction
}

const DEFAULT_VARIANTS: VeNftVariant[] = [
  {
    id: 1,
    name: 'Cool guy',
    tokensStakedMin: 1,
    imageUrl: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME}/ipfs/QmTqHj8L5S2B7w1pqUn9hHyzddB27pgKEwFTwPRRQoqj96`,
  },
  {
    id: 2,
    name: 'Rich guy',
    tokensStakedMin: 1000,
    imageUrl: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME}/ipfs/QmTqHj8L5S2B7w1pqUn9hHyzddB27pgKEwFTwPRRQoqj96`,
  },
  {
    id: 3,
    name: 'Extra rich guy',
    tokensStakedMin: 1000000,
    imageUrl: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME}/ipfs/QmTqHj8L5S2B7w1pqUn9hHyzddB27pgKEwFTwPRRQoqj96`,
  },
  {
    id: 3,
    name: 'Top Baller',
    tokensStakedMin: 1000000000,
    imageUrl: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME}/ipfs/QmTqHj8L5S2B7w1pqUn9hHyzddB27pgKEwFTwPRRQoqj96`,
  },
]

const VeNftSetupModal = ({ visible, onCancel }: VeNftSetupModalProps) => {
  const [addTierModalVisible, setAddTierModalVisible] = useState(false)
  const [addLockDurationModalVisible, setAddLockDurationModalVisible] =
    useState(false)
  const [variants, setVariants] = useState<VeNftVariant[]>(DEFAULT_VARIANTS)
  const [lockDurationOptions, setLockDurationOptions] = useState<number[]>(
    DEFAULT_LOCK_DURATIONS,
  )

  const sortVariants = (variants: VeNftVariant[]): VeNftVariant[] => {
    return variants.sort((a, b) =>
      a.tokensStakedMin > b.tokensStakedMin
        ? 1
        : b.tokensStakedMin > a.tokensStakedMin
        ? -1
        : 0,
    )
  }

  const handleAddVariant = (variant: VeNftVariant) => {
    setVariants(sortVariants([...variants, variant]))
  }

  const handleAddLockDurationOption = (lockDurationOption: number) => {
    const newOptions = [...lockDurationOptions, lockDurationOption]
    const sorted = newOptions.sort((a, b) => a - b)
    setLockDurationOptions(sorted)
  }

  const handleEditVariant = (index: number, newVariant: VeNftVariant) => {
    const newVariants = variants.map((tier, i) =>
      i === index
        ? {
            ...tier,
            ...newVariant,
          }
        : tier,
    )
    setVariants(newVariants)
  }

  const handleDeleteVariant = (id: number) => {
    setVariants([...variants.slice(0, id), ...variants.slice(id + 1)])
  }

  const handleDeleteLockDurationOption = (id: number) => {
    setLockDurationOptions([
      ...lockDurationOptions.slice(0, id),
      ...lockDurationOptions.slice(id + 1),
    ])
  }

  return (
    <>
      <TransactionModal
        title={t`Set Up veNFT Governance`}
        visible={visible}
        onCancel={onCancel}
        okText={t`Launch veNFT`}
      >
        <p>
          <Trans>Set up and launch veNFT governance for your project.</Trans>
        </p>
        <MinimalCollapse
          header={
            <h3 style={{ marginBottom: 0 }}>
              {t`veNFT Tiers (${variants.length} variants)`}
            </h3>
          }
          defaultActiveKey={['1']}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {variants.map((variant, index) => (
              <VeNftvariantCard
                key={index}
                variant={variant}
                nextVariant={
                  index === variants.length - 1
                    ? undefined
                    : variants[index + 1]
                }
                onChange={newVariant => handleEditVariant(index, newVariant)}
                onDelete={() => handleDeleteVariant(index)}
              />
            ))}
          </Space>

          <Button
            type="dashed"
            onClick={() => {
              setAddTierModalVisible(true)
            }}
            style={{ marginTop: 15 }}
            block
          >
            <Trans>Add reward tier</Trans>
          </Button>
        </MinimalCollapse>
        <MinimalCollapse
          header={
            <h3
              style={{ marginBottom: 0 }}
            >{t`Lock Durations (${lockDurationOptions.length} options)`}</h3>
          }
          defaultActiveKey={['1']}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {lockDurationOptions.map((lockDurationOption, index) => (
              <VeNftLockDurationOptionCard
                key={index}
                lockDurationOption={lockDurationOption}
                onDelete={() => handleDeleteLockDurationOption(index)}
              />
            ))}
          </Space>
          <Button
            type="dashed"
            onClick={() => {
              setAddLockDurationModalVisible(true)
            }}
            style={{ marginTop: 15 }}
            block
          >
            <Trans>Add lock duration option</Trans>
          </Button>
        </MinimalCollapse>
      </TransactionModal>
      {addTierModalVisible && (
        <VeNftRewardTierModal
          id={variants.length}
          visible={addTierModalVisible}
          onChange={handleAddVariant}
          onClose={() => setAddTierModalVisible(false)}
          mode="Add"
        />
      )}
      {addLockDurationModalVisible && (
        <VeNftAddLockDurationModal
          visible={addLockDurationModalVisible}
          onChange={handleAddLockDurationOption}
          onClose={() => setAddLockDurationModalVisible(false)}
        />
      )}
    </>
  )
}

export default VeNftSetupModal
