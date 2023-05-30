/* eslint-disable @typescript-eslint/no-empty-function */
const i18n = {
  load: () => {},
  loadLocaleData: () => {},
  activate: () => {},
  _: ({ message, values }) =>
    message
      ? message.replace(/{([A-Za-z0-9]+)}/g, (str, prop) => values[prop])
      : '',
}
export { i18n }
