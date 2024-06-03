import { t, Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { createContactMessage } from 'lib/api/discord'
import Image from 'next/image'
import { useContext, useState } from 'react'
import contactHeroDark from '/public/assets/images/contact-hero-od.webp'
import contactHeroLight from '/public/assets/images/contact-hero-ol.webp'

export function Contact() {
  const { forThemeOption } = useContext(ThemeContext)
  const [contactPlaceholder, setContactPlaceholder] = useState<string>(
    'banny@juicebox.money',
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [contactType, setContactType] = useState<ListboxOption>(
    contactTypeOptions()[0],
  )

  const [form] = Form.useForm<FormValues>()

  const onFormSubmit = async (values: FormValues) => {
    setError(false)
    setSuccess(false)

    try {
      setLoading(true)
      await createContactMessage({
        message: values.message,
        name: values.name,
        contact: values.contact,
        contactPlatform: contactType.value,
        subject: values.subject.value,
      })

      setSuccess(true)
    } catch (e) {
      setError(true)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (option: ListboxOption) => {
    const examples = new Map<string, string>([
      ['email', 'banny@juicebox.money'],
      ['discord', 'banny#4200'],
      ['twitter', '@banny'],
      ['telegram', '@banny'],
    ])

    setContactType(option)
    setContactPlaceholder(examples.get(option.value) ?? 'Your contact')
  }

  const contactTypes = (
    <JuiceListbox
      className="min-w-[9em]"
      buttonClassName="py-2.5"
      options={contactTypeOptions()}
      value={contactType}
      onChange={handleSelect}
    />
  )

  return (
    <>
      <div className="mx-auto mt-5 mb-36 max-w-5xl px-4 lg:px-0">
        <div className="flex gap-14">
          <div className="w-full lg:w-7/12">
            <h1 className="m-0 my-4 font-display text-4xl">
              <Trans>Contact</Trans>
            </h1>
            <p>
              <Trans>
                Got a question or need help creating your project? Fill out the
                form below and we’ll get back to you as soon as possible. You
                can also reach out to us on{' '}
                <ExternalLink href="https://discord.gg/juicebox">
                  Discord
                </ExternalLink>{' '}
                for a faster response.
              </Trans>
            </p>
            <Form
              onFinish={onFormSubmit}
              form={form}
              layout="vertical"
              className="mt-5 flex max-w-4xl flex-col gap-2"
              initialValues={{
                contactPlatform: contactTypeOptions()[0].value,
                subject: subjectOptions()[0],
              }}
            >
              <Form.Item
                name="name"
                label={t`Your Name`}
                required
                rules={[{ required: true, message: 'Enter your name.' }]}
              >
                <JuiceInput placeholder="Banny" size="large" />
              </Form.Item>
              <div>
                <Form.Item
                  label={t`Where to Contact You`}
                  required
                  rules={[{ required: true, message: 'Enter a contact.' }]}
                  className="mb-0"
                />
                <div className="-mt-1 flex gap-4">
                  {contactTypes}
                  <Form.Item
                    name="contact"
                    required
                    rules={[{ required: true, message: 'Enter a contact.' }]}
                    className="grow"
                  >
                    <JuiceInput placeholder={contactPlaceholder} size="large" />
                  </Form.Item>
                </div>
              </div>
              <Form.Item name="subject" label={t`Subject`}>
                <JuiceListbox
                  buttonClassName="py-2.5"
                  options={subjectOptions()}
                />
              </Form.Item>
              <Form.Item
                name="message"
                label={t`Your Message`}
                rules={[{ required: true, message: 'Enter a message.' }]}
              >
                <JuiceTextArea
                  maxLength={500}
                  showCount={true}
                  rows={5}
                  placeholder="Enter a message..."
                  size="large"
                />
              </Form.Item>
              <div>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  <span>
                    <Trans>Send Message</Trans>
                  </span>
                </Button>
              </div>
            </Form>

            <p>
              {success && (
                <span className="mt-4 text-bluebs-500">
                  <Trans>Message sent!</Trans>
                </span>
              )}
              {error && (
                <span className="mt-4 text-error-500">
                  <Trans>Failed to send message.</Trans>
                </span>
              )}
            </p>
          </div>

          <div className="hidden items-center lg:flex lg:w-5/12">
            <div>
              <Image
                src={
                  forThemeOption?.({
                    light: contactHeroLight,
                    dark: contactHeroDark,
                  }) ?? ''
                }
                alt="Banny making a phone call"
                height={546}
                width={437}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface FormValues {
  name: string
  contact: string
  contactPlatform: string
  subject: ListboxOption
  message: string
}

interface ListboxOption {
  value: string
  label: string
}
const contactTypeOptions = (): ListboxOption[] => [
  { value: 'email', label: t`Email` },
  { value: 'discord', label: t`Discord` },
  { value: 'twitter', label: t`Twitter` },
  { value: 'telegram', label: t`Telegram` },
]

const subjectOptions = (): ListboxOption[] => [
  {
    value: 'project help',
    label: t`Get help planning or setting up my project.`,
  },
  { value: 'feature request', label: t`Request a feature.` },
  { value: 'media inquiry', label: t`I have a media inquiry.` },
  { value: 'general question', label: t`I have a question.` },
  { value: 'other', label: t`Other.` },
]
