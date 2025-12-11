import React from 'react'

import { TSearchGameItem } from 'blocks/search-game/SearchGame'
import { useL10n } from 'provider/I18nProvider'
import { EGamePrice, EGameUnit } from 'types/store'

import styles from './SearchListTooltip.module.scss'

export type SearchListTooltipProps = {
  item: TSearchGameItem;
};

const SearchListTooltip = ({ item }: SearchListTooltipProps) => {
  const l10n = useL10n()

  const targetLabels: Record<string, string> = {
    [EGamePrice.PRODUCTION]: l10n('UI.PRODUCTION_COST'),
    [EGamePrice.SELLING]: l10n('UI.SELLING'),
    [EGameUnit.REPUTATION]: l10n('UI.REPUTATION')
  }

  return (
    <div className={ styles.wrapper }>
      <p className={ styles.name }>{ l10n(item.name) }</p>
      <p className={ styles.description }>{ l10n(item.description) }</p>
      <div className={ styles.effects }>
        { item.acceptValues
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
    </div>
  )
}

export default SearchListTooltip
