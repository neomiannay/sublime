import React from 'react'

import { useL10n } from 'provider/I18nProvider'
import { EChoice, EGamePrice, EGameUnit } from 'types/store'
import {
  TSearchGameItem,
  TSearchGameLayoutInfos
} from 'blocks/search-game/SearchGame'
import { useGameProviderContext } from 'provider/GameProvider'

import styles from './SearchResults.module.scss'
import { SOUNDS } from 'data/constants'
import { useAudioContext } from 'provider/AudioProvider'

export type SearchResultsProps = {
  newItem: TSearchGameItem | null;
  layoutInfos: TSearchGameLayoutInfos;
  setSearchState: (searchState: number) => void;
  saveNewItem: (item: TSearchGameItem) => void;
};

const SearchResults = ({
  newItem,
  layoutInfos,
  setSearchState,
  saveNewItem
}: SearchResultsProps) => {
  const { applyChoiceEffects } = useGameProviderContext()
  const { playSound } = useAudioContext()
  const l10n = useL10n()

  const handleChoice = (choice: EChoice) => {
    const itemEffects =
      choice === EChoice.ACCEPT
        ? newItem?.acceptValues
        : newItem?.declineValues

    if (itemEffects)
      applyChoiceEffects(itemEffects)

    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.ARROW)

    if (newItem && choice === EChoice.ACCEPT) saveNewItem(newItem)

    setSearchState(0) // Reset to initial state
  }

  const targetLabels: Record<string, string> = {
    [EGamePrice.PRODUCTION]: l10n('UI.PRODUCTION_COST'),
    [EGamePrice.SELLING]: l10n('UI.SELLING'),
    [EGameUnit.REPUTATION]: l10n('UI.REPUTATION')
  }

  return (
    <div className={ styles.wrapper }>
      { newItem && (
        <>
          <h6 className={ styles.subTitle }>{ l10n(layoutInfos.new) }</h6>
          <p className={ styles.name }>{ l10n(newItem.name) }</p>
          <p className={ styles.description }>{ l10n(newItem.description) }</p>
          <div className={ styles.effects }>
            { newItem.acceptValues
              .filter((value) => value.target !== EGameUnit.KARMA)
              .map((value, index) => (
                <div key={ index }>
                  <small>
                    { targetLabels[value.target] ?? value.target }:
                  </small>
                  <p className={ styles.effectsValue }>
                    +{ value.value.toString() }
                    { value.target === EGameUnit.REPUTATION
                      ? l10n('UNITS.PERCENT')
                      : l10n('UNITS.EURO') }
                  </p>
                </div>
              )) }
          </div>
          <div className={ styles.choices }>
            <button onClick={ () => handleChoice(EChoice.DECLINE) }>
              { l10n(layoutInfos.decline) }
            </button>
            <button onClick={ () => handleChoice(EChoice.ACCEPT) }>
              { l10n(layoutInfos.accept) }
            </button>
          </div>
        </>
      ) }
    </div>
  )
}

export default SearchResults
