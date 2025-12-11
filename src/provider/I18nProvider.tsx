import { createContext, useCallback, useContext, useMemo } from 'react'

import { get, each, set } from 'lodash-es'

import frJson from 'data/i18n/fr.json' with { type: 'json' }
import enJson from 'data/i18n/en.json' with { type: 'json' }

import { BaseProviderProps } from './GlobalProvider'

type I18nVariables = { [key: string]: string } | null
export type I18n = (key: string, variables?: I18nVariables, fallback?: boolean) => string
export type SupportedLocale = 'fr' | 'en'

const translations: Record<SupportedLocale, typeof frJson> = {
  fr: frJson,
  en: enJson
}

const DEFAULT_LOCALE: SupportedLocale = 'fr'

// Get locale from URL parameter (?lang=fr or ?lang=en)
export const getLocaleFromURL = (): SupportedLocale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang')

  if (lang === 'fr' || lang === 'en') {
    return lang
  }

  return DEFAULT_LOCALE
}

// Add conjugate as a utility function outside the provider
export const conjugate = (key: string, count: number) => {
  const parts = key.split('.')
  if (parts.length > 1) {
    const lastPart = parts.pop()
    return count > 1 ? `${parts.join('.')}.${lastPart}.PLURAL` : `${parts.join('.')}.${lastPart}.SINGULAR`
  }
  return key
}

export const I18nContext = createContext<I18n>({} as I18n)
export const LocaleContext = createContext<SupportedLocale>(DEFAULT_LOCALE)

export const buildI18n = (locale: SupportedLocale) => {
  const json = translations[locale]
  const formatted = {}
  each(json, (value, key) => {
    set(formatted, key, value)
  })

  return (key: string, variables: I18nVariables = null, fallback = true) => {
    let v = get(formatted, key, fallback ? '🚨 ' + key : false) as string
    if (variables) each(variables, (value, key) => { v = v.replace(`%${key}%`, value) })
    return v
  }
}

export const I18nProvider = ({ children }: BaseProviderProps) => {
  const locale = useMemo(() => getLocaleFromURL(), [])
  const i18n = useCallback(buildI18n(locale), [locale])

  return (
    <LocaleContext.Provider value={locale}>
      <I18nContext.Provider value={i18n}>
        {children}
      </I18nContext.Provider>
    </LocaleContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw Error('useI18n must be used inside an `I18nProvider`')
  return context
}

export const useLocale = () => {
  return useContext(LocaleContext)
}

// Legacy exports for backwards compatibility during migration
export const L10nContext = I18nContext
export const L10nProvider = I18nProvider
export const useL10n = useI18n
export const buildl10n = (data: any) => buildI18n(DEFAULT_LOCALE)
export type L10n = I18n
