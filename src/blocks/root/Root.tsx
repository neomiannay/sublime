import React, { useState } from 'react'

import classNames from 'classnames'
import Shop from 'blocks/shop/Shop'
import Meta from 'blocks/meta/Meta'
import Header from 'blocks/header/Header'
import Sectors from 'blocks/sectors/Sectors'
import { AnimatePresence, motion } from 'motion/react'
import { baseVariants, fade } from 'core/animation'
import useTransitionType from 'hooks/useTransitionType'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import Background from 'blocks/background/Background'
import { useLoaderContext } from 'provider/LoaderProvider'
import ActivateSound from 'blocks/activate-sound/ActivateSound'
import { useL10n } from 'provider/I18nProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import EndScreen from 'blocks/end-screen/EndScreen'

import styles from './Root.module.scss'
import Loading from './components/loading/Loading'

type RootProps = {
  className?: string;
};
function Root ({ className }: RootProps) {
  const l10n = useL10n()
  const { isLoading } = useLoaderContext()
  const { reactiveCurrentSector, sectors } = useSectorsProviderContext()
  const { isGameEnding } = useGameProviderContext()

  const custom = { type: useTransitionType(reactiveCurrentSector, sectors) }

  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false)

  return (
    <main
      className={ classNames(styles.wrapper, {
        [styles.loading]: isLoading
      }) }
    >

      { isLoading || !isBackgroundLoaded ? (
        <Loading />
      ) : (
        <>
          <Meta />

          <AnimatePresence mode='wait'>
            { !isGameEnding ? (
              <motion.div
                { ...baseVariants }
                { ...fade }
              >
                <Header />

                <AnimatePresence custom={ custom }>
                  <Sectors key='sectors' { ...baseVariants } />
                </AnimatePresence>

                <Shop />
              </motion.div>
            ) : (
              <EndScreen />
            ) }
          </AnimatePresence>
          { /* <button
              className={ classNames(styles.pauseButton, {
                [styles.paused]: isPaused
              }) }
              onClick={ togglePause }

            >
              { isPaused ? 'Paused' : 'Running' }
            </button> */ }

          <ActivateSound />
        </>
      ) }

      <Background
        onLoad={ () => requestAnimationFrame(() => {
          setIsBackgroundLoaded(true)
        }) }
      />
    </main>
  )
}

export default Root
