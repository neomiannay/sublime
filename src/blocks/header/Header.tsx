import React, { useEffect, useMemo, useRef } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { useL10n } from 'provider/I18nProvider'
import useMotionState from 'hooks/useMotionState'
import { usePricesContext } from 'provider/PricesProvider'
import { EGamePrice, EGameUnit } from 'types/store'
import ReputationIndicator from 'components/reputation-indicator/ReputationIndicator'
import SectorsTab from 'blocks/sectors/sectors-tab/SectorsTab'
import { AnimatePresence, motion } from 'motion/react'
import { baseVariants, fadeAppear, stagger } from 'core/animation'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'
import { formatBenefits, formatValue } from 'helpers/units'
import { useResizeObserver } from 'hooks/useResizeObserver'
import { useViewportContext } from 'provider/ViewportProvider'
import MaskText from 'components/mask-text/MaskText'

import styles from './Header.module.scss'

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { sizes } = useViewportContext()
  const { getUnit, canDisplayUnit } = useGameProviderContext()
  const { getPrice } = usePricesContext()

  const benefits = getUnit(EGameUnit.BENEFITS)
  const productionPrice = getPrice(EGamePrice.PRODUCTION)
  const sellingPrice = getPrice(EGamePrice.SELLING)

  const l10n = useL10n()

  const benefitsCount = benefits
    ? useMotionState(benefits.motionValue, (value) => value)
    : 0
  const productionCount = useMotionState(
    productionPrice.motionValue,
    (value) => value
  )
  const sellingCount = useMotionState(
    sellingPrice.motionValue,
    (value) => value
  )

  const benefitsMemo = useMemo(
    () => formatBenefits(benefitsCount),
    [benefitsCount]
  )

  useEffect(() => {
    if (!ref.current) return
    if (!canDisplayUnit(EGameUnit.BENEFITS)) ref.current.style.height = 'var(--header-height)'
    else if (canDisplayUnit(EGameUnit.BENEFITS)) ref.current.style.height = 'auto'
  }, [canDisplayUnit])

  useResizeObserver(ref as any, () => {
    const height = ref.current?.offsetHeight as number
    sizes.headerHeight.set(height)
  })

  return (
    <div ref={ ref } className={ classNames(styles.wrapper) }>
      <AnimatePresence mode='wait'>
        { canDisplayUnit(EGameUnit.BENEFITS) && (
          <motion.div
            className={ classNames(styles.content, className) }
            { ...baseVariants }
            { ...stagger() }
          >
            <div className={ styles.pricesContainer }>
              <motion.div className={ styles.prices } { ...fadeAppear() }>
                <div className={ styles.price }>
                  <span className={ styles.title }>
                    { l10n('PRICES.PRODUCTION') }
                  </span>
                  <span className={ styles.count }>
                    <MaskText opened={ false } replayKey={ productionCount }>
                      { formatValue(productionCount, 2) } €
                    </MaskText>
                  </span>
                </div>
                <div className={ styles.price }>
                  <span className={ styles.title }>{ l10n('PRICES.SELLING') }</span>
                  <span className={ styles.count }>
                    <MaskText opened={ false } replayKey={ sellingCount }>
                      { formatValue(sellingCount, 2) } €
                    </MaskText>
                  </span>
                </div>
              </motion.div>

              <div className={ styles.sectors }>
                <motion.div { ...fadeAppear() }>
                  <SectorsTab />
                </motion.div>
              </div>

              <motion.div { ...fadeAppear() }>
                <ReputationIndicator />
              </motion.div>
            </div>

            <div className={ classNames(styles.benefits) }>
              <motion.div { ...fadeAppear() }>
                <AdaptativeText
                  className={ classNames(styles.money, styles.blur) }
                >
                  { benefitsMemo } €
                </AdaptativeText>
                <AdaptativeText className={ classNames(styles.money, styles.base) }>
                  { benefitsMemo } €
                </AdaptativeText>
              </motion.div>
            </div>
          </motion.div>
        ) }
      </AnimatePresence>
    </div>
  )
}

export default Header
