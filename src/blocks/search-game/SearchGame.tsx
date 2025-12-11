import React from 'react'

import { EGamePrice, EGameSector, EGameUnit } from 'types/store'
import { useL10n } from 'provider/I18nProvider'
import { DEFAULT_SCALE_FACTOR, getRoundedTime } from 'helpers/units'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useSearchPublicityContext } from 'provider/SearchPublicityProvider'

import styles from './SearchGame.module.scss'
import SearchContainer from './components/search-container/SearchContainer'
import SearchListItem from './components/search-list-item/SearchListItem'

export type TSearchGameItemValue = {
  value: number;
  target: EGameUnit | EGamePrice;
};

export type TSearchGameItem = {
  id: string;
  disabled: boolean;
  name: string;
  description: string;
  toxic?: boolean;
  acceptValues: TSearchGameItemValue[];
  declineValues: TSearchGameItemValue[];
};

export type TSearchGameLayoutInfos = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  new: string;
  list: string;
  probability: string;
  duration: string;
  decline: string;
  accept: string;
};

export type SearchGameProps = {
  duration: number; // In seconds
  price: number; // In euros
  layoutInfos: TSearchGameLayoutInfos;
  items: TSearchGameItem[];
  sectorId: EGameSector;
};

const SearchGame: React.FC<SearchGameProps> = ({
  duration,
  price,
  layoutInfos,
  items,
  sectorId
}) => {
  const l10n = useL10n()
  const { complexComposition } = useSearchLaboratoryContext()
  const { tips } = useSearchPublicityContext()

  const roundedTime = getRoundedTime(duration)

  let itemList

  switch (sectorId) {
    case EGameSector.LABORATORY:
      itemList = complexComposition
      break

    case EGameSector.PUBLICITY:
      itemList = tips
      break

    default:
      itemList = complexComposition
      break
  }

  return (
    <div className={ styles.wrapper }>
      <h3 className={ styles.name }>{ l10n(layoutInfos.name) }</h3>
      <hr className={ styles.divider } />
      <SearchContainer
        layoutInfos={ layoutInfos }
        duration={ duration }
        roundedTime={ roundedTime }
        price={{
          unit: EGameUnit.BENEFITS,
          value: price * ((itemList?.length || 0) * DEFAULT_SCALE_FACTOR + 1)
        }}
        items={ items }
        sectorId={ sectorId }
      />
      { itemList && (
        <>
          <hr className={ styles.divider } />
          <div className={ styles.itemsContainer }>
            <h6 className={ styles.subTitle }>{ l10n(layoutInfos.list) }</h6>
            <div className={ styles.itemsWrapper }>
              { itemList?.map((item, index) => (
                <React.Fragment key={ item.id }>
                  <SearchListItem item={ item } index={ index } list={ itemList } />
                </React.Fragment>
              )) }
            </div>
          </div>
        </>
      ) }
    </div>
  )
}

export default SearchGame
