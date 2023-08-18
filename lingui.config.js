const { formatter } = require('@lingui/format-po')

const locales = ['en', 'zh']

if (process.env.NODE_ENV !== 'production') {
  locales.push('pseudo')
}

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: locales,
  sourceLocale: 'en',
  pseudoLocale: 'pseudo',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: formatter({ origins: false, lineNumbers: false }),
  orderBy: 'messageId',
  fallbackLocales: {
    default: 'en',
  },
}
