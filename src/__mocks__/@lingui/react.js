const Trans = function ({ message, values }) {
    let replacedMessage = message
    for (const key in values) {
      // eslint-disable-next-line no-prototype-builtins
      if (values.hasOwnProperty(key)) {
        const regex = new RegExp(`\\{${key}\\}`, 'g')
        replacedMessage = replacedMessage.replace(regex, values[key])
      }
    }
    return replacedMessage
  },
  I18nProvider = function ({ children }) {
    return children
  }
export { Trans, I18nProvider }
