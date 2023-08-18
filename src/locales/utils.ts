export async function loadCatalog(locale: string) {
  const { messages } = await import(`@lingui/loader!./${locale}/messages.po`)

  return messages
}
