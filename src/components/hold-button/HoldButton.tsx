import { useState, useEffect, useRef, FC } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/I18nProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import useMotionState from 'hooks/useMotionState'

import styles from './HoldButton.module.scss'
import { SOUNDS } from 'data/constants'
import { useAudioContext } from 'provider/AudioProvider'

interface HoldButtonProps {
  className?: string;
  label: string;
  autoMode?: boolean;
  value: number;
}

const HoldButton: FC<HoldButtonProps> = ({ className, label, autoMode, value }) => {
  const l10n = useL10n()
  const { getUnit, buyUnit, canBuyUnit } = useGameProviderContext()
    const { playSound } = useAudioContext()

  const activeUnit = getUnit(EGameUnit.ACTIF)
  const duration = getUnit(EGameUnit.COMPLEX)?.duration?.get() ?? 5000

  if (!activeUnit) return

  const [progress, setProgress] = useState<number>(100)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const canAfford = useMotionState(activeUnit?.motionValue, () => (activeUnit?.rawValue.get() ?? 0) > value)

  const canBuy = canBuyUnit(EGameUnit.COMPLEX)

  const handleClick = () => {
    if (!canBuy || isAnimating || !canAfford) return
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.HOLD)

    setProgress(20)
    setIsAnimating(true)

    const interval = 100
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 20
    timerRef.current = setInterval(() => {
      currentProgress += increment

      if (currentProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)

        setProgress(100)

        setTimeout(() => {
          buyUnit(EGameUnit.COMPLEX)
          setIsAnimating(false)
          playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.HOLD_END)
          setTimeout(() => setProgress(100), 200)
        }, 50)
      } else {
        setProgress(currentProgress)
      }
    }, interval)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!autoMode || isAnimating) return

    handleClick()
  }, [autoMode, isAnimating])

  return (
    <div
      className={ classNames(styles.wrapper, className, {
        [styles.disabled]: !canBuy || !canAfford
      }) }
    >
      <div onClick={ handleClick } className={ styles.colorContainer }>
        <div
          className={ styles.endColor }
          style={{
            clipPath: `inset(0 0 ${progress}% 0)`,
            transition: 'clip-path 0.05s linear'
          }}
        >
          { l10n(label) }
        </div>
        <div className={ styles.startColor }>
          <div className={ styles.swoosh }>{ l10n(label) }</div>
        </div>
      </div>
    </div>
  )
}

export default HoldButton
