import React, { createContext, useContext, PropsWithChildren, Dispatch, SetStateAction, useState, useMemo } from 'react'

import { getStorageKey } from 'hooks/useGamePersistence'
import { GameState } from 'types/store'

import { I18nProvider } from './I18nProvider'
import { ViewportProvider } from './ViewportProvider'
import { GameProvider } from './GameProvider'
import { IterationProvider } from './IterationProvider'
import { InventoryProvider } from './InventoryProvider'
import { PricesProvider } from './PricesProvider'
import { MessageSystemProvider } from './MessageSystemProvider'
import { FeedbackProvider } from './FeedbackProvider'
import { SectorsProvider } from './SectorsProvider'
import { SearchLaboratoryProvider } from './SearchLaboratoryProvider'
import { SearchPublicityProvider } from './SearchPublicityProvider'
import { ShopProvider } from './ShopProvider'
import { LoaderProvider } from './LoaderProvider'
import { AudioProvider } from './AudioProvider'

type GlobalContextType = {
  darkMode: boolean
  setDarkMode: Dispatch<SetStateAction<boolean>>
}

export const GlobalContext = createContext<GlobalContextType | null>(null)

export type BaseProviderProps = PropsWithChildren<{}>;

let context: GlobalContextType

export const GlobalProvider = ({ children }: BaseProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const storage = localStorage.getItem(getStorageKey())
    if (!storage) return false

    const parsedStorage = JSON.parse(storage) as GameState
    return parsedStorage.darkMode ?? false
  })

  useMemo(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const providers = [
    LoaderProvider,
    ViewportProvider,
    I18nProvider,
    AudioProvider,
    PricesProvider, // PricesProvider should be before GameProvider to ensure prices are available
    FeedbackProvider,
    GameProvider,
    InventoryProvider,
    SectorsProvider,
    MessageSystemProvider,
    SearchLaboratoryProvider,
    SearchPublicityProvider,
    ShopProvider,
    IterationProvider
  ]

  context = {
    darkMode,
    setDarkMode
  }

  return (
    <GlobalContext.Provider value={ context }>
      { providers.reverse().reduce(
        (children, Provider) => (
          <Provider>{ children }</Provider>
        ),
        children
      ) }
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context)
    throw Error('useGlobalContext must be used inside a `GlobalProvider`')
  return context
}

export const getGlobalContext = () => {
  if (!context) throw Error('getGlobalContext can\'t be used server-side')
  return context
}
