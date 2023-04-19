import { Trans, t } from '@lingui/macro'
import { Button, Form } from 'antd'
import { Footer } from 'components/Footer'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { createJuicenewsSubscription } from 'lib/api/juicenews'
import Image from 'next/image'
import { useContext, useState } from 'react'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'
import { FaqList } from '../FaqList'
import { StatsSection } from '../StatsSection'
import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { NewsletterSection } from './NewsletterSection'
import { OldSectionHeading } from './OldSectionHeading'
import { TopProjectsSection } from './TopProjectsSection'
import TrendingSection from './TrendingSection'
import orangeLadyOd from '/public/assets/images/orange_lady-od.png'
import orangeLadyOl from '/public/assets/images/orange_lady-ol.png'

type NewsletterFormType = {
  email: string
}

const FooterNewsletterSection = () => {
  const [form] = Form.useForm<NewsletterFormType>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      await createJuicenewsSubscription(form.getFieldValue('email'))
      emitInfoNotification(t`Successfully subscribed to Juicenews!`)
    } catch (e) {
      emitErrorNotification(t`Subcription to juicenews failed.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-smoke-100 px-12 py-8 dark:bg-slate-600">
      <div className="m-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <div className="text-base font-medium">
            <Trans>Stay up to date 🧃</Trans>
          </div>
          <div>
            <Trans>
              Subscribe to Juicenews to get the latest updates from the Juicebox
              ecosystem.
            </Trans>
          </div>
        </div>

        <Form
          className="flex flex-col gap-3 md:flex-row"
          onFinish={onSubmit}
          form={form}
        >
          <div className="relative min-w-[300px] flex-1">
            <Form.Item name="email">
              <JuiceInput
                type="email"
                placeholder={t`Your email address`}
                className="h-10"
                required
              />
            </Form.Item>
          </div>
          <Button htmlType="submit" type="primary" loading={isLoading}>
            <Trans>Subscribe</Trans>
          </Button>
        </Form>
      </div>
    </section>
  )
}

const JuiceLady = () => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <Image
      src={forThemeOption?.({
        [ThemeOption.dark]: orangeLadyOd,
        [ThemeOption.light]: orangeLadyOl,
      })}
      alt="Powerlifting Juicebox orange hitting an olympic lift"
      loading="lazy"
    />
  )
}

export function OldHomePage() {
  return (
    <div>
      <HeroSection />

      <StatsSection />

      <TrendingSection />

      <TopProjectsSection />

      <HowItWorksSection />

      <NewsletterSection />

      <section>
        <div id="faq" className="my-0 mx-auto max-w-5xl py-20 px-7">
          <OldSectionHeading className="mb-10 text-left">
            <Trans>FAQs</Trans>
          </OldSectionHeading>
          <FaqList />
        </div>
      </section>

      <div className="-mb-3 flex justify-center">
        <JuiceLady />
      </div>
      <FooterNewsletterSection />
      <Footer />
    </div>
  )
}
