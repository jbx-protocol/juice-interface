// generate mock for LanguageProvider

import { I18nProviderProps } from '../LanguageProvider'

export const LanguageProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return <div>{children}</div>
}
