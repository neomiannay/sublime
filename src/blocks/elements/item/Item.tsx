import React from 'react'

import classNames from 'classnames'
import { EGameUnit, ItemType } from 'types/store'
import { conjugate, useL10n } from 'provider/I18nProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import { useSequentialPurchaseState } from 'hooks/useSequentialPurchase'
import useElementPurchased from 'hooks/useElementPurchased'
import useCanBuyElement from 'hooks/useCanBuyElement'
import useItemCount from 'hooks/useItemCount'
import Button from 'components/button/Button'
import { formatValue, getItemPrice } from 'helpers/units'
import MaskText from 'components/mask-text/MaskText'
import { motion } from 'motion/react'
import { baseVariants, fadeAppear, stagger } from 'core/animation'
import { useAudioContext } from 'provider/AudioProvider'
import { SOUNDS } from 'data/constants'

import styles from './Item.module.scss'

type ItemProps = {
  className?: string;
  unitId: EGameUnit;
  itemId: string;
  item: ItemType;
};

const Item = ({ className, unitId, itemId, item }: ItemProps) => {
  const { getElementsForUnit, getItemCount, buyElement } = useInventoryContext()
  const { playSound } = useAudioContext()
  const l10n = useL10n()

  const items = getElementsForUnit(unitId, 'item')

  // Function to check if previous item has been purchased
  const canPurchaseItemSequentially = (itemId: string) => {
    const itemIds = Object.keys(items)
    const currentIndex = itemIds.indexOf(itemId)

    if (currentIndex === 0) return true // first item so always purchasable

    // Otherwise, check if previous item is purchased
    if (currentIndex > 0) {
      const previousItemId = itemIds[currentIndex - 1]
      return getItemCount(unitId, previousItemId) > 0
    }

    return false
  }

  const isPurchased = useElementPurchased(unitId, itemId, 'item')
  const sequentiallyPurchasable =
    useSequentialPurchaseState(unitId, itemId, 'item') &&
    canPurchaseItemSequentially(itemId)
  const itemCount = useItemCount(unitId, itemId)
  const canPurchase =
    useCanBuyElement(unitId, itemId, 'item', itemCount) && sequentiallyPurchasable

  const cost = getItemPrice(item.cost.value, itemCount)
  const unitName = `UNITS.${item.cost.unitId.toString().toUpperCase()}`
  const costName = `(${l10n(conjugate(unitName, cost))})`

  const label = l10n((unitId === EGameUnit.SALE) ? 'BUTTONS.TARGET' : 'BUTTONS.BUY')

  const handleClick = () => {
    buyElement(unitId, itemId, 'item')
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.BUY_BASIC)
  }

  if (!isPurchased) return null

  return (
    <motion.div
      className={ classNames(styles.wrapper, className, {
        [styles.unavailable]: !sequentiallyPurchasable
      }) }
      { ...baseVariants }
      { ...stagger(0.1, 0.6) }
    >
      <div className={ styles.line }>
        <div className={ styles.information }>
          <div className={ styles.left }>
            <motion.h4
              className={ styles.title }
              { ...fadeAppear() }
            >
              { l10n(item.name) }
            </motion.h4>
            <motion.span
              className={ styles.unitByTime }
              { ...fadeAppear() }
            >
              [ { item.unitByTime }/{ l10n('UNITS.SEC') } ]
            </motion.span>
          </div>
          <motion.span
            className={ styles.count }
            { ...fadeAppear() }
          >
            <MaskText opened={ false } replayKey={ itemCount }>
              { formatValue(itemCount) }
            </MaskText>
          </motion.span>
        </div>
        <motion.p
          className={ styles.description }
          { ...fadeAppear() }
        >
          { l10n(item.description) }
          { /* +{ item.unitByTime }/{ l10n('UNITS.SEC') } */ }
        </motion.p>
      </div>
      <motion.div
        { ...fadeAppear() }
      >
        <Button
          className={ styles.button }
          onClick={ handleClick }
          disabled={ !canPurchase }
          cost={{
            value: cost,
            unit: costName
          }}
          action={ label }
        />
      </motion.div>
    </motion.div>
  )
}

export default Item
