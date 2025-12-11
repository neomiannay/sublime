import React from 'react'

import { SearchGameProps } from 'blocks/search-game/SearchGame'
import { useL10n } from 'provider/I18nProvider'
import classNames from 'classnames'
import Translatable from 'components/translatable/Translatable'

import styles from './SearchInfos.module.scss'

export type SearchInfosProps = {
  layoutInfos: SearchGameProps['layoutInfos'];
  efficiency: number;
  roundedTime: {
    value: number;
    unit: string;
  };
};

const SearchInfos = ({
  layoutInfos,
  efficiency,
  roundedTime
}: SearchInfosProps) => {
  const l10n = useL10n()

  return (
    <div className={ styles.container }>
      <div className={ styles.item }>
        <h4 className={ styles.itemLabel }>
          { l10n(layoutInfos.title) }
        </h4>
        <h5 className={ styles.itemValue }>
          { l10n(layoutInfos.subtitle) }
        </h5>
        <p className={ styles.itemDesc }>
          { l10n(layoutInfos.description) }
        </p>
      </div>
      <div
        className={ classNames(
          styles.item,
          styles.itemComposition
        ) }
      >
        <div
          style={{
            transform: 'rotate(5deg)',
            zIndex: 1
          }}
        >
          <Translatable>
            <div className={ styles.card }>
              <h4 className={ styles.cardValue }>
                { efficiency + l10n('UNITS.PERCENT') }
              </h4>
              <p className={ styles.cardDesc }>
                { l10n(layoutInfos.probability) }
              </p>
            </div>
          </Translatable>
        </div>
        <div
          style={{
            transform: 'translate(-10px, -5px) rotate(-4deg)'
          }}
        >
          <Translatable>
            <div className={ styles.card }>
              <h4 className={ styles.cardValue }>
                { roundedTime.value + l10n(roundedTime.unit) }
              </h4>
              <p className={ styles.cardDesc }>
                { l10n(layoutInfos.duration) }
              </p>
            </div>
          </Translatable>
        </div>
      </div>
    </div>
  )
}

export default SearchInfos
