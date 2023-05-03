import { Trans, t } from '@lingui/macro'
import { Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { useSetTokenUriResolverForProjectTx } from 'hooks/v2v3/transactor/SetTokenUriForProjectTx'
import { useState } from 'react'
import { isAddress } from 'ethers/lib/utils'

export const CustomResolverForm = () => {
  const [form] = useForm()
  const [loadingSetTokenUriResolver, setLoadingSetTokenUriResolver] =
    useState<boolean>()
  const setTokenUriResolverForProjectTx = useSetTokenUriResolverForProjectTx()

  function onFinishCustomResolverForm() {
    setLoadingSetTokenUriResolver(true)

    setTokenUriResolverForProjectTx(
      { resolver: String(form.getFieldValue('customResolverAddress')).trim() },
      {
        onDone: () => setLoadingSetTokenUriResolver(false),
      },
    )
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinishCustomResolverForm}>
      <Form.Item
        name="customResolverAddress"
        label={t`Custom resolver address`}
        rules={[
          {
            validator: (_, value) => {
              const address = value
              if (!address || !isAddress(address))
                return Promise.reject(t`Enter a valid Ethereum address`)
              else return Promise.resolve()
            },
          },
        ]}
      >
        <EthAddressInput />
      </Form.Item>
      <Button
        htmlType="submit"
        type="primary"
        loading={loadingSetTokenUriResolver}
      >
        <Trans>Set custom resolver</Trans>
      </Button>
    </Form>
  )
}
