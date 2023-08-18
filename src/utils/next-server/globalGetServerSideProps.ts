import { loadCatalog } from 'locales/utils'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

/**
 * `getServerSideProps` for all pages.
 *
 *  This is a global getServerSideProps that is used for all pages. It is used
 *  to load the i18n catalog for the page.
 *
 * @param ctx
 * @returns
 */
export default async function globalGetServerSideProps(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<unknown>> {
  const locale = ctx.locale as string
  const messages = await loadCatalog(locale)
  return {
    props: {
      i18n: { messages, locale },
    },
  }
}
