import React from 'react'

import classNames from 'classnames'
import { EGameUnit, ElementType, ItemType, OtherShopElementType, SectorType, UpgradeType } from 'types/store'
import { useSequentialPurchaseState } from 'hooks/useSequentialPurchase'
import { useInventoryContext } from 'provider/InventoryProvider'
import { conjugate, useL10n } from 'provider/I18nProvider'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import { useShopProviderContext } from 'provider/ShopProvider'
import useElementPurchased from 'hooks/useElementPurchased'
import useCanBuyElement from 'hooks/useCanBuyElement'
import { motion } from 'motion/react'
import { baseTransition, baseVariants, fadeAppear } from 'core/animation'
import { bezier } from 'helpers/easing'
import useItemCount from 'hooks/useItemCount'

import styles from './ShopElement.module.scss'
import { SOUNDS } from 'data/constants'
import { useAudioContext } from 'provider/AudioProvider'
import { useGameProviderContext } from 'provider/GameProvider'

type ShopElementProps = {
  className?: string;
  elementId: string;
  element: ItemType | UpgradeType | SectorType | OtherShopElementType;
  unitId: EGameUnit;
  type: ElementType;
};

const ShopElement = ({ className, elementId, element, unitId, type }: ShopElementProps) => {
  const { translateYValue } = useShopProviderContext()
  const { buyElementFromShop, shouldDisplayElement } = useInventoryContext()
  const { setUnlockedSectors, unlockedSectors } = useSectorsProviderContext()
  const { playSound } = useAudioContext()
  const { getUnit } = useGameProviderContext()

  const l10n = useL10n()
  const isPurchased = useElementPurchased(unitId, elementId, type)
  const count = useItemCount(unitId, elementId) || 1

  const canPurchase = useCanBuyElement(unitId, elementId, type, count)
  const shouldDisplay = shouldDisplayElement(unitId, elementId, type)
  const sequentiallyPurchasable = useSequentialPurchaseState(
    unitId,
    elementId,
    type
  )

  if (!shouldDisplay || isPurchased) return null

  const isItem = type === 'item'
  const isUpgrade = type === 'upgrade'
  const isSector = type === 'sector'
  const isOther = type === 'otherShopElement'
  const rawUnitName = unitId.toString().toUpperCase()
  const unitName = `UNITS.${rawUnitName}`
  const rawCostUnitName = element.cost.unitId.toString().toUpperCase()
  const costUnitName = `UNITS.${rawCostUnitName}`

  const elementSector = () => {
    if (isItem) return `BUTTONS.${rawUnitName}`
    if (isUpgrade) return `BUTTONS.${rawUnitName}`
    if (isSector) return `SECTORS.${(element as SectorType)._id.toString().toUpperCase()}`
    if (isOther) return `SECTORS.${(element as OtherShopElementType).sectorId.toString().toUpperCase()}`

    return ''
  }

  // Variants qui respectent le stagger du parent
  const shopElementVariants = {
    initial: { y: '30%', opacity: 0 },
    animate: {
      y: '0%',
      opacity: 1
    },
    hover: {
      y: `${translateYValue}px`,
      opacity: 1
    },
    normal: {
      y: '0%',
      opacity: 1
    },
    exit: {
      y: '30%',
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: bezier.quintEaseInOut
      }
    }
  }

  const getEffectText = () => {
    if (isUpgrade && unitId !== EGameUnit.COMPLEX) {
      const newValueByAction = (element as UpgradeType).valueByAction
      const unitName = `UNITS.${unitId.toString().toUpperCase()}`
      return `+${newValueByAction} ${l10n(conjugate(unitName, newValueByAction))}/clic`
    } else if (unitId !== EGameUnit.COMPLEX) {
      const item = element as ItemType
      const unitName = `UNITS.${unitId.toString().toUpperCase()}`
      return `${item.unitByTime} ${l10n(conjugate(unitName, item.unitByTime))}/s`
    }
  }

  const handleSectorClick = () => {
    if (isSector) {
      const sector = element as SectorType
      setUnlockedSectors([...(unlockedSectors || []), sector._id])
    }
  }

  const handleBuyClick = () => {
    buyElementFromShop(unitId, elementId, type)
    handleSectorClick()
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.BUY_SHOP)
  }

  return (
    <motion.div
      className={ classNames(styles.wrapper, className) }
      variants={ shopElementVariants }
      transition={ baseTransition }
    >
      <motion.button
        className={ classNames(styles.container, {
          [styles.unavailable]: !sequentiallyPurchasable || !canPurchase,
          [styles.isSector]: isSector || isOther
        }) }
        { ...baseVariants }
        { ...fadeAppear() }
        onClick={ handleBuyClick }
        disabled={ !sequentiallyPurchasable || !canPurchase }
      >
        <div className={ styles.whiteBackground } />
        <div className={ styles.inner }>
          <div className={ styles.content }>
            <h4 className={ styles.title }>{ l10n(element.name) }</h4>
            { (!isSector && !isOther) && (
              <span className={ styles.effect }>{ getEffectText() }</span>
            ) }
            <p className={ styles.text }>{ l10n(element.description) }</p>
          </div>
          <div className={ styles.bottom }>
            <span className={ styles.cost }>
              { element.cost.value } <span>({ l10n(conjugate(costUnitName, element.cost.value)) })</span>
            </span>
            <span className={ styles.unitEffect }>
              { elementSector() && l10n(elementSector()) }
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  )
}

export default ShopElement
