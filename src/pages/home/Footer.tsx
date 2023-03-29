import { GithubFilled, TwitterCircleFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, InputProps } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import Logo from 'components/Navbar/Logo'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { createJuicenewsSubscription } from 'lib/api/juicenews'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useContext } from 'react'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'
import * as Yup from 'yup'
import orangeLadyOd from '/public/assets/orange_lady-od.png'
import orangeLadyOl from '/public/assets/orange_lady-ol.png'

type LinkItem = {
  title: ReactNode
  link: string
  externalLink?: boolean
}

const LinkCols: { title: ReactNode; items: LinkItem[] }[] = [
  {
    title: t`Juicebox`,
    items: [
      {
        title: t`Create project`,
        link: '/create',
      },
      {
        title: t`Explore`,
        link: '/projects',
      },
      {
        title: t`Referral`,
        externalLink: true,
        link: 'https://juicebox.referral.qwestive.io/referral/hJCUZVJIodVP6Ki6MP6e',
      },
    ],
  },
  {
    title: t`Resources`,
    items: [
      {
        title: t`Docs`,
        externalLink: true,
        link: 'https://docs.juicebox.money',
      },
      {
        title: t`Newsletter`,
        externalLink: true,
        link: 'https://juicenews.beehiiv.com',
      },
      {
        title: t`Podcast`,
        externalLink: true,
        link: 'https://podcasters.spotify.com/pod/show/thejuicecast',
      },
      {
        title: t`Contact`,
        link: '/contact',
      },
    ],
  },
  {
    title: t`Socials`,
    items: [
      {
        title: t`Discord`,
        externalLink: true,
        link: 'https://discord.com/invite/wFTh4QnDzk',
      },
      {
        title: t`GitHub`,
        externalLink: true,
        link: 'https://github.com/jbx-protocol',
      },
      {
        title: t`Twitter`,
        externalLink: true,
        link: 'https://twitter.com/juiceboxETH',
      },
    ],
  },
  {
    title: t`Legal`,
    items: [
      {
        title: t`Privacy Policy`,
        link: '/privacy',
      },
      {
        title: t`Terms of Service`,
        externalLink: true,
        link: TERMS_OF_SERVICE_URL,
      },
    ],
  },
]

const ImageButtons = [
  {
    name: 'github',
    image: <GithubFilled />,
    link: 'https://github.com/jbx-protocol',
  },
  {
    name: 'discord',
    image: <Discord size={18} />,
    link: 'https://discord.com/invite/wFTh4QnDzk',
  },
  {
    name: 'twitter',
    image: <TwitterCircleFilled />,
    link: 'https://twitter.com/juiceboxETH',
  },
]

export function Footer() {
  const gitCommit = process.env.NEXT_PUBLIC_VERSION

  return (
    <>
      <div className="-mb-3 flex justify-center">
        <JuiceLady />
      </div>
      <NewsletterSection />
      <div className="bg-slate-900 px-12 pt-12 text-white">
        <div className="m-auto max-w-6xl">
          <div className="flex flex-col gap-y-10 md:grid md:grid-cols-6 md:items-start md:gap-x-10">
            <div className="flex flex-col gap-y-5 md:col-span-2 md:items-start">
              <Logo themeOverride="dark" />
              <Trans>
                Big ups to the Ethereum community for crafting the
                infrastructure and economy to make Juicebox possible.
              </Trans>
            </div>
            {LinkCols.map((props, i) => (
              <LinkColumn key={i} {...props} />
            ))}
          </div>

          <div className="mt-32 flex justify-between border border-b-0 border-r-0 border-l-0 border-solid border-slate-400 pb-16 pt-5">
            <span className="text-grey-300">© Juicebox 2023</span>

            <div className="flex gap-x-7">
              {gitCommit && <AppVersion gitCommit={gitCommit} />}
              <div className="flex gap-x-4 ">
                {ImageButtons.map(({ name, image, link }) => (
                  <ExternalLink
                    key={name}
                    name={name}
                    title={name}
                    className="text-lg leading-none text-grey-300 hover:text-bluebs-500"
                    href={link}
                  >
                    {image}
                  </ExternalLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const NewsletterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required(t`Required`),
})

type NewsletterFormType = {
  email: string
}

const NewsletterSection = () => {
  const initialValues: NewsletterFormType = {
    email: '',
  }

  const onSubmit = async (
    values: NewsletterFormType,
    helpers: FormikHelpers<NewsletterFormType>,
  ) => {
    try {
      await createJuicenewsSubscription(values.email)
      emitInfoNotification(t`Successfully subscribed to Juicenews!`)
    } catch (e) {
      emitErrorNotification(t`Subcription to juicenews failed.`)
    }
    helpers.setSubmitting(false)
  }

  return (
    <section className="bg-smoke-50 px-12 py-8 dark:bg-slate-600">
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
        <Formik
          initialValues={initialValues}
          validationSchema={NewsletterSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3 md:flex-row">
              <div className="relative min-w-[300px] flex-1">
                <Field
                  type="email"
                  name="email"
                  placeholder={t`Your email address`}
                  as={(props: InputProps) => (
                    <JuiceInput {...props} className="h-10" />
                  )}
                />
                <ErrorMessage
                  className="text-error mt-2 md:absolute md:top-8"
                  name="email"
                  component="div"
                />
              </div>
              <Button htmlType="submit" type="primary" loading={isSubmitting}>
                Subscribe
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  )
}

const LinkColumn: React.FC<{ title: ReactNode; items: LinkItem[] }> = ({
  title,
  items,
}) => (
  <div className="flex flex-col gap-y-3">
    <div className="text-grey-300">{title}</div>
    {items.map(({ title, link, externalLink }, i) => (
      <div key={i}>
        {externalLink ? (
          <ExternalLink
            className="text-slate-100 hover:text-bluebs-500"
            href={link}
          >
            {title}
          </ExternalLink>
        ) : (
          <Link href={link}>
            <a className="text-slate-100 hover:text-bluebs-500">{title}</a>
          </Link>
        )}
      </div>
    ))}
  </div>
)

const AppVersion = ({ gitCommit }: { gitCommit: string }) => {
  const gitCommitLink = `https://github.com/jbx-protocol/juice-interface/commit/${gitCommit}`
  return (
    <div className="text-grey-300">
      Version:{' '}
      <ExternalLink
        href={gitCommitLink}
        className="text-grey-300 underline hover:text-bluebs-500"
      >
        #{gitCommit}
      </ExternalLink>
    </div>
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
