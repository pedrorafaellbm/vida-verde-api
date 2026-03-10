import { createContext, useContext, useMemo } from 'react'
import { translations } from '../i18n/translations'

const I18nContext = createContext(null)

const resolveLocale = () => {
  if (typeof navigator === 'undefined') return 'pt'
  const language = (navigator.language || navigator.userLanguage || 'pt-BR').toLowerCase()
  if (language.startsWith('en')) return 'en'
  return 'pt'
}

const getValue = (source, key) =>
  key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), source)

export const LocaleProvider = ({ children }) => {
  const locale = useMemo(() => resolveLocale(), [])

  const value = useMemo(() => ({
    locale,
    t(key, params = {}) {
      const dictionary = translations[locale] || translations.pt
      const fallback = translations.pt
      const template = getValue(dictionary, key) ?? getValue(fallback, key) ?? key
      return String(template).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
    },
  }), [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside LocaleProvider')
  return context
}
