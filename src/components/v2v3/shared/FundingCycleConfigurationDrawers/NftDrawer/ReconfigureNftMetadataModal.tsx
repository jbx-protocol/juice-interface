import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Callout from 'components/Callout'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useReconfigureNftCollectionMetadata } from 'hooks/v2v3/transactor/ReconfigureNftCollectionMetadata'
import { NftCollectionMetadata } from 'models/nftRewardTier'
import { useContext, useState } from 'react'
import { MarketplaceFormFields } from './formFields'
import { NftMarketplaceCustomizationForm } from './NftMarketplaceCustomizationForm'

export function ReconfigureNftMetadataModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const [formHasUpdated, setFormHasUpdated] = useState<boolean>()
  const [txLoading, setTxLoading] = useState<boolean>()
  const [marketplaceForm] = useForm<MarketplaceFormFields>()

  const reconfigureNftCollectionMetadata = useReconfigureNftCollectionMetadata({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  const submitCollectionMetadata = async () => {
    if (!fundingCycleMetadata?.dataSource) return
    setTxLoading(true)
    const newCollectionMetadata: NftCollectionMetadata = {
      name: marketplaceForm.getFieldValue('collectionName'),
      description: marketplaceForm.getFieldValue('collectionDescription'),
      symbol: marketplaceForm.getFieldValue('collectionSymbol'),
    }
    const txSuccessful = await reconfigureNftCollectionMetadata({
      ...newCollectionMetadata,
      dataSource: fundingCycleMetadata?.dataSource,
    })
    setTxLoading(false)
    if (txSuccessful) {
      onClose()
    }
  }

  return (
    <Modal
      title={t`Reconfigure collection details`}
      open={open}
      onCancel={onClose}
      okText={t`Confirm`}
      okButtonProps={{
        disabled: !formHasUpdated,
      }}
      onOk={submitCollectionMetadata}
      confirmLoading={txLoading}
    >
      <Space size="large" direction="vertical">
        <Callout>
          <Trans>
            Changes to your collection details may not be reflected in some
            marketplaces (for example, Opensea). Please contact the marketplace
            for support.
          </Trans>
        </Callout>
        <NftMarketplaceCustomizationForm
          form={marketplaceForm}
          onFormUpdated={() => setFormHasUpdated(true)}
          isReconfigure
        />
      </Space>
    </Modal>
  )
}
