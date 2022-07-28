import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { VeNftVariant } from 'models/v2/veNft'
import { useState } from 'react'

import VeNftRewardTierModal from 'components/veNft/VeNftRewardTierModal'
import VeNftvariantCard from 'components/veNft/VeNftVariantCard'

interface VeNftSetupModalProps {
  visible: boolean
  onCancel: VoidFunction
}

const VeNftSetupModal = ({ visible, onCancel }: VeNftSetupModalProps) => {
  const [addTierModalVisible, setAddTierModalVisible] = useState(false)
  const [variants, setVariants] = useState<VeNftVariant[]>([])

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

  return (
    <>
      <TransactionModal
        title={t`Set Up veNFT Governance`}
        visible={visible}
        onCancel={onCancel}
      >
        <Trans>Set up and launch veNFT governance for your project.</Trans>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {variants.map((variant, index) => (
            <VeNftvariantCard
              key={index}
              variant={variant}
              nextVariant={
                index === variants.length - 1 ? undefined : variants[index + 1]
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
    </>
  )
}

export default VeNftSetupModal
