import React, { PropsWithChildren, useCallback, useEffect } from 'react'

import classNames from 'classnames'
import Button from 'components/button/Button'
import { useAudioContext } from 'provider/AudioProvider'
import { animate, AnimatePresence, motion, useMotionValue } from 'motion/react'
import { baseTransition, baseVariants, fadeAppear, staggerWithExit } from 'core/animation'
import { SOUNDS } from 'data/constants'
import { useL10n } from 'provider/I18nProvider'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'

import styles from './ActivateSound.module.scss'

type ActivateSoundProps = PropsWithChildren<{
  className?: string
}>

const ActivateSound = ({ className, ...props } : ActivateSoundProps) => {
  const { playSound, setAudioEnabled, audioEnabled } = useAudioContext()
  const l10n = useL10n()

  const refOpacity = useMotionValue(1)

  const handleClick = (enabled: boolean) => {
    setAudioEnabled(enabled)
  }

  const handlePlaySound = useCallback(() => {
    playSound(SOUNDS.AMBIANCE.CATEGORY, SOUNDS.AMBIANCE.MAIN, true)
  }, [playSound])

  useEffect(() => {
    if (audioEnabled === true) handlePlaySound()

    if (audioEnabled !== null) {
      animate(refOpacity, 0, {
        duration: baseTransition.duration,
        ease: baseTransition.ease,
        delay: 0.5
      })
    }
  }, [handlePlaySound, audioEnabled])

  return (
    <AnimatePresence>
      { audioEnabled === null && (
        <motion.div
          className={ classNames(styles.wrapper, className) }
          { ...props }
          { ...baseVariants }
          { ...staggerWithExit(0.1, 0.5) }
          style={{ opacity: refOpacity }}
        >
          <motion.div
            className={ styles.content }
          >
            <motion.span { ...fadeAppear() }>
              <AdaptativeText className={ styles.title }>
                { l10n('BUTTONS.ACTIVATE_SOUND.TITLE') }
              </AdaptativeText>
            </motion.span>
            <div className={ styles.buttons }>
              <Button
                variant='simple'
                action={ l10n('BUTTONS.ACTIVATE_SOUND.CONFIRM') }
                onClick={ () => handleClick(true) }
                motionProps={ fadeAppear() }
              />
              <Button
                variant='simple'
                action={ l10n('BUTTONS.ACTIVATE_SOUND.CANCEL') }
                onClick={ () => handleClick(false) }
                motionProps={ fadeAppear() }
              />
            </div>
          </motion.div>
        </motion.div>
      ) }
    </AnimatePresence>
  )
}

export default React.memo(ActivateSound)
