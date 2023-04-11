import { t, Trans } from '@lingui/macro'
import { Button, Col, Form, Input, Row } from 'antd'
import useMobile from 'hooks/Mobile'
import { createJuicenewsSubscription } from 'lib/api/juicenews'
import Image from 'next/image'
import { useState } from 'react'
import { OldSectionHeading } from './OldSectionHeading'
import stretchyPineapple from '/public/assets/stretchy-pineapple.png'

export function NewsletterSection() {
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const isMobile = useMobile()

  const [form] = Form.useForm()

  const onFormSubmit = async () => {
    setSuccess(false)
    setError(false)

    try {
      setLoading(true)
      await createJuicenewsSubscription(form.getFieldValue('email'))
      setSuccess(true)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-smoke-50 p-8 py-20 px-7 text-black dark:bg-slate-600">
      <div className="my-0 mx-auto max-w-5xl">
        <Row align="middle" gutter={40}>
          <Col xs={24} md={14}>
            <OldSectionHeading className="mb-6 text-left text-black dark:text-slate-100">
              <Trans>Stay up to date.</Trans>
            </OldSectionHeading>
            <div className="text-black">
              <p className="mb-6 text-base text-black dark:text-slate-100">
                Subscribe to Juicenews to get the latest updates from the
                Juicebox ecosystem.
              </p>

              <Form layout="inline" onFinish={() => onFormSubmit()} form={form}>
                <Form.Item name="email" className="m-0 w-full md:w-3/5">
                  <Input
                    type="email"
                    size="large"
                    placeholder={t`Your email address`}
                  />
                </Form.Item>
                <div className="ml-0 md:ml-2">
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full md:w-auto"
                  >
                    Subscribe
                  </Button>
                </div>
              </Form>

              <p>
                {success && (
                  <span className="text-bluebs-500">
                    You successfully subscribed!
                  </span>
                )}
                {error && (
                  <span className="text-error-500">Failed to subscribe.</span>
                )}
              </p>
            </div>
          </Col>

          {!isMobile && (
            <Col xs={24} md={10}>
              <Image
                src={stretchyPineapple}
                alt="Juicebox Pineapple stretching because Juicebox is flexible"
                loading="lazy"
              />
            </Col>
          )}
        </Row>
      </div>
    </section>
  )
}
