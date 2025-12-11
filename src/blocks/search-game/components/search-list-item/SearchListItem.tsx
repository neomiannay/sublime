import React, { useRef } from 'react'

import { TSearchGameItem } from 'blocks/search-game/SearchGame'
import { useL10n } from 'provider/I18nProvider'
import Tooltip from 'components/tooltip/Tooltip'

import SearchListTooltip from './search-list-tooltip/SearchListTooltip'
import styles from './SearchListItem.module.scss'

export type SearchListItemProps = {
  item: TSearchGameItem;
  list: TSearchGameItem[];
  index: number;
};

const SearchListItem = ({ item, index, list }: SearchListItemProps) => {
  const l10n = useL10n()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <small>
      <span ref={ ref } className={ styles.text }>
        { l10n(item.name) + (index !== list.length - 1 ? ', ' : '.') }
      </span>
      <Tooltip
        parent={ ref }
        disabled={ false }
        className={ styles.tooltip }
      >
        <SearchListTooltip item={ item } />
      </Tooltip>
    </small>
  )
}

export default SearchListItem
