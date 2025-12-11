import React, { memo, useEffect, useState } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import { EGameUnit } from 'types/store'
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'motion/react'
import { fadeAppear } from 'core/animation'
import { useShopProviderContext } from 'provider/ShopProvider'
import { useL10n } from 'provider/I18nProvider'

import ShopElements from './shop-elements/ShopElements'
import styles from './Shop.module.scss'

type ShopMainViewProps = {
  className?: string
  motionWrapperRef: React.RefObject<HTMLDivElement | null>
}

const ShopMainView = ({ className, motionWrapperRef, ...props }: ShopMainViewProps) => {
  const { canDisplayUnit, units } = useGameProviderContext()
  const { getElementsForUnit } = useInventoryContext()
  const { shopTitleRef, translateYValue, shopOpen } = useShopProviderContext()

  const l10n = useL10n()

  const [hasAnimated, setHasAnimated] = useState(false)

  const unitIds = Object.keys(units) as EGameUnit[]

  const hoverProgress = useMotionValue(0)

  const animatedTranslateY = useTransform(
    hoverProgress,
    [0, 1],
    [0, translateYValue]
  )

  const translateYCssVar = useMotionTemplate`${animatedTranslateY}px`

  useEffect(() => {
    hoverProgress.set(shopOpen ? 1 : 0)
  }, [shopOpen, hoverProgress])

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    },
    hover: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: 1
      }
    },
    normal: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: 1
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getAnimateState = () => {
    if (!hasAnimated) return 'animate'
    return shopOpen ? 'hover' : 'normal'
  }

  return (
    <>
      <motion.h2
        ref={ shopTitleRef }
        className={ styles.title }
        { ...fadeAppear() }
      >
        { l10n('PROJECTS') }
      </motion.h2>
      <motion.div
        { ...fadeAppear() }
      >
        <motion.aside
          className={ classNames(styles.wrapperMainShop, className) }
          variants={ containerVariants }
          animate={ getAnimateState() }
          initial='initial'
          style={{
            '--translateYValue': translateYCssVar
          } as React.CSSProperties}
        >
          { unitIds.slice(0, 5).map((unitId) => {
            if (!canDisplayUnit(unitId)) return null

            const items = getElementsForUnit(unitId, 'item')
            const upgrades = getElementsForUnit(unitId, 'upgrade')
            const sectors = getElementsForUnit(unitId, 'sector')
            const otherShopElements = getElementsForUnit(unitId, 'otherShopElement')

            const hasElements =
              Object.keys(items).length > 0 || Object.keys(upgrades).length > 0 || Object.keys(sectors).length > 0

            if (!hasElements) return null

            return (
              <React.Fragment key={ unitId }>
                <ShopElements
                  elements={ upgrades }
                  unitId={ unitId }
                  type='upgrade'
                />
                <ShopElements
                  elements={ items }
                  unitId={ unitId }
                  type='item'
                />
                <ShopElements
                  elements={ sectors }
                  unitId={ unitId }
                  type='sector'
                />
                <ShopElements
                  elements={ otherShopElements }
                  unitId={ unitId }
                  type='otherShopElement'
                />
              </React.Fragment>
            )
          }) }
        </motion.aside>
      </motion.div>
    </>
  )
}

export default memo(ShopMainView)
