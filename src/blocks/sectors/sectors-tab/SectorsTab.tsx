import React, { PropsWithChildren, useRef, useEffect, useState, useMemo } from 'react'

import classNames from 'classnames'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import { useL10n } from 'provider/I18nProvider'
import { fadeAppear } from 'core/animation'
import GradientText from 'components/gradient-text/GradientText'
import { motion } from 'motion/react'

import styles from './SectorsTab.module.scss'

type SectorsTabProps = PropsWithChildren<{
  className?: string
}>

const SectorsTab = ({ className, ...props }: SectorsTabProps) => {
  const { defaultUnlockedSector, unlockedSectors, reactiveCurrentSector, setCurrentSector } = useSectorsProviderContext()
  const l10n = useL10n()
  const [activeButtonBounds, setActiveButtonBounds] = useState<DOMRect | null>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  const hasSectors = useMemo(() => unlockedSectors?.length && unlockedSectors.length > 0, [unlockedSectors])

  useEffect(() => {
    const activeButton = buttonRefs.current[reactiveCurrentSector]
    if (!activeButton) return

    const updateBounds = () => {
      const bounds = activeButton.getBoundingClientRect()
      const parentBounds = activeButton.parentElement?.getBoundingClientRect()

      if (parentBounds) {
        const relativeBounds = {
          width: bounds.width,
          height: bounds.height,
          left: bounds.left - parentBounds.left,
          top: bounds.top - parentBounds.top
        } as DOMRect

        setActiveButtonBounds(relativeBounds)
      }
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(updateBounds)
      })
    } else {
      requestAnimationFrame(updateBounds)
    }
  }, [reactiveCurrentSector, defaultUnlockedSector, unlockedSectors])

  return hasSectors && (
    <motion.div
      className={ classNames(styles.wrapper, className) }
      { ...fadeAppear() }
      { ...props }
    >
      { (activeButtonBounds) && (
        <motion.div
          className={ styles.activeBackground }
          initial={ false }
          animate={{
            x: activeButtonBounds.left,
            y: activeButtonBounds.top,
            width: activeButtonBounds.width,
            height: activeButtonBounds.height
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        />
      ) }

      <motion.button
        ref={ (el) => {
          if (el) buttonRefs.current[defaultUnlockedSector] = el
        } }
        className={ classNames(styles.sector, {
          [styles.active]: defaultUnlockedSector === reactiveCurrentSector
        }) }
        onClick={ () => setCurrentSector(defaultUnlockedSector) }
        tabIndex={ 1 }
      >
        <GradientText
          startColor={ defaultUnlockedSector === reactiveCurrentSector ? 'var(--fill-60)' : 'var(--color-money)' }
          endColor={ defaultUnlockedSector === reactiveCurrentSector ? 'var(--fill-100)' : 'var(--fill-60)' }
          duration={ 1.5 }
        >
          { l10n(`SECTORS.${defaultUnlockedSector.toUpperCase()}`) }
        </GradientText>
      </motion.button>

      { unlockedSectors?.map((sector, index) => {
        return (
          <motion.button
            key={ sector }
            ref={ (el) => {
              if (el) buttonRefs.current[sector] = el
            } }
            className={ classNames(styles.sector, {
              [styles.active]: reactiveCurrentSector === sector
            }) }
            onClick={ () => setCurrentSector(sector) }
            tabIndex={ index + 2 }
            { ...fadeAppear() }
          >
            <GradientText
              startColor={ reactiveCurrentSector === sector ? 'var(--fill-60)' : 'var(--color-money)' }
              endColor={ reactiveCurrentSector === sector ? 'var(--fill-100)' : 'var(--fill-60)' }
              duration={ 1.5 }
            >
              { l10n(`SECTORS.${sector.toUpperCase()}`) }
            </GradientText>
          </motion.button>
        )
      }) }

    </motion.div>
  )
}

export default SectorsTab
