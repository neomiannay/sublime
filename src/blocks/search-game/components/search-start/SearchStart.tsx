import React from 'react'

import { EGameSector, EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import { TSearchGameItem } from 'blocks/search-game/SearchGame'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useSearchPublicityContext } from 'provider/SearchPublicityProvider'
import Button from 'components/button/Button'
import { useL10n } from 'provider/I18nProvider'

import styles from './SearchStart.module.scss'
import { SOUNDS } from 'data/constants'
import { useAudioContext } from 'provider/AudioProvider'

export type SearchStartProps = {
  isError: boolean;
  setIsError?: (isError: boolean) => void
  price: {
    unit: EGameUnit;
    value: number;
  };
  duration: number;
  items: TSearchGameItem[];
  setSearchState: (searchState: number) => void;
  startProgress: (duration: number) => void;
  setNewItem: (item: TSearchGameItem) => void;
  sectorId: EGameSector;
};

const SearchStart = ({
  isError,
  setIsError,
  price,
  duration,
  items,
  setSearchState,
  startProgress,
  setNewItem,
  sectorId
}: SearchStartProps) => {
  const { hasEnoughUnits, modifyUnitValue } = useGameProviderContext()
  const { complexComposition } = useSearchLaboratoryContext()
  const { tips } = useSearchPublicityContext()
  const { playSound } = useAudioContext()
  const l10n = useL10n()

  let filteredItems: TSearchGameItem[] = items
  if (sectorId === EGameSector.LABORATORY && complexComposition) {
    filteredItems = items.filter(
      (item) => !complexComposition.some((addedItem) => addedItem.id === item.id)
    )
  } else if (sectorId === EGameSector.PUBLICITY && tips) {
    filteredItems = items.filter(
      (item) => !tips.some((addedItem) => addedItem.id === item.id)
    )
  }

  const handleClick = () => {
    if (!hasEnoughUnits(price.value, price.unit)) return
    setIsError?.(false)

    setSearchState(1)
    startProgress(duration)
    modifyUnitValue(price.unit, -price.value)
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.CLICK_BASIC)

    // const randomItem =
    //   filteredItems[Math.floor(Math.random() * filteredItems.length)]
    // setNewItem(randomItem)
    const firstItem = filteredItems[0]
    setNewItem(firstItem)
  }

  const disabled = !hasEnoughUnits(price.value, price.unit)

  return (
    <div className={ styles.container }>
      <div className={ styles.microscopeWrapper }>
        { isError && (<div className={ styles.error }>{ l10n('SEARCH_ACTIFS.LAYOUT.ERROR') }</div>) }
        <svg
          width='80'
          height='80'
          viewBox='0 0 80 80'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={ styles.microscope }
        >
          <path
            d='M20 59.9998H46.6667M10 73.3332H70M46.6667 73.3332C52.8551 73.3332 58.79 70.8748 63.1658 66.499C67.5417 62.1231 70 56.1882 70 49.9998C70 43.8115 67.5417 37.8765 63.1658 33.5007C58.79 29.1248 52.8551 26.6665 46.6667 26.6665H43.3333M30 46.6665H36.6667M40 19.9998V9.99984C40 9.11578 39.6488 8.26794 39.0237 7.64281C38.3986 7.01769 37.5507 6.6665 36.6667 6.6665H30C29.1159 6.6665 28.2681 7.01769 27.643 7.64281C27.0179 8.26794 26.6667 9.11578 26.6667 9.99984V19.9998M30 39.9998C28.2319 39.9998 26.5362 39.2975 25.286 38.0472C24.0357 36.797 23.3333 35.1013 23.3333 33.3332V19.9998H43.3333V33.3332C43.3333 35.1013 42.631 36.797 41.3807 38.0472C40.1305 39.2975 38.4348 39.9998 36.6667 39.9998H30Z'
            stroke='var(--color-money)'
            strokeOpacity={ isError ? 0.25 : 1 }
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>

      <Button
        className={ styles.button }
        type='button'
        disabled={ disabled }
        cost={{
          value: price.value,
          unit: l10n('UNITS.EURO')
        }}
        action={ l10n('SEARCH_ACTIFS.LAYOUT.BUTTON_LABEL') }
        onClick={ handleClick }
      />
    </div>
  )
}

export default SearchStart
