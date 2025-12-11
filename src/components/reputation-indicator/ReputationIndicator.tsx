import React from 'react'

import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import useMotionState from 'hooks/useMotionState'
import MaskText from 'components/mask-text/MaskText'
import { useL10n } from 'provider/I18nProvider'

import styles from './ReputationIndicator.module.scss'

const getReputationLabel = (value: number): string => {
  if (value >= 80) return 'Excellente'
  if (value >= 60) return 'Très bonne'
  if (value >= 40) return 'Bonne'
  if (value >= 20) return 'Moyenne'
  return 'Mauvaise'
}

const ReputationIndicator = () => {
  const l10n = useL10n()
  const { getUnit } = useGameProviderContext()

  const reputation = getUnit(EGameUnit.REPUTATION)
  if (!reputation) return null

  const reputationValue = useMotionState(reputation.motionValue, (value) => value)
  const clampedValue = Math.min(reputationValue, 100)
  const label = getReputationLabel(clampedValue)

  return (
    <div className={ styles.wrapper }>
      <span className={ styles.title }>{ l10n('UNITS.REPUTATION') }</span>
      <div className={ styles.label }>
        <MaskText opened={ false } replayKey={ clampedValue }>
          { label } [{ clampedValue }%]
        </MaskText>
      </div>
    </div>
  )
}

export default ReputationIndicator
