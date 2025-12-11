import React from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import HoldButton from 'components/hold-button/HoldButton'
import AutoSwitch from 'blocks/auto-switch/AutoSwitch'
import useMotionState from 'hooks/useMotionState'
import Count from 'components/count/Count'
import { conjugate, useL10n } from 'provider/I18nProvider'
import { useUpgradePurchased } from 'hooks/useUpgradePurchased'
import Button from 'components/button/Button'
import { getItemPrice } from 'helpers/units'
import MaskText from 'components/mask-text/MaskText'
import { SOUNDS } from 'data/constants'
import { useAudioContext } from 'provider/AudioProvider'

import styles from './ComplexSection.module.scss'

type ComplexSectionProps = {
  className?: string;
  unitId: EGameUnit;
};

const DEFAULT_SUBSTRACTION_VALUE = 500
const DEFAULT_TIME_PRICE = 56

const ComplexSection = ({ className, unitId }: ComplexSectionProps) => {
  const l10n = useL10n()
  const { getUnit, hasEnoughUnits, modifyUnitValue, updateUnitDuration, updateValueByAction, complexAutoMode, setComplexAutoMode } = useGameProviderContext()
  const { playSound } = useAudioContext()

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)

  let formattedSeconds = ''
  let duration = 0

  const complexDuration = unit.duration
  if (complexDuration) {
    duration = useMotionState(complexDuration, (v) => v)

    const seconds = duration / 1000
    formattedSeconds = seconds.toFixed(1)
  }

  let quantity = 1
  const valueByAction = unit.valueByAction
  if (valueByAction) quantity = useMotionState(valueByAction, (value) => value)

  const canPurchaseTime = (unitsNeeded: number, unitId: EGameUnit) => {
    if (duration <= DEFAULT_SUBSTRACTION_VALUE) return false
    return hasEnoughUnits(unitsNeeded, unitId)
  }

  const improveTime = () => {
    if (!canPurchaseTime(reactiveTimeCost, EGameUnit.ACTIF)) return
    updateUnitDuration(EGameUnit.COMPLEX, DEFAULT_SUBSTRACTION_VALUE)
    modifyUnitValue(EGameUnit.ACTIF, -reactiveTimeCost)
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.BUY_BASIC)
  }

  const improveValueByAction = (
    unitId: EGameUnit,
    requiredUnitId: EGameUnit
  ) => {
    if (!hasEnoughUnits(quantityCost, requiredUnitId)) return
    const unit = getUnit(unitId)
    if (!unit) return

    updateValueByAction(unitId, 1, quantityCost)
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.BUY_BASIC)
  }

  const handleAutoSwitch = () => {
    setComplexAutoMode(prev => !prev)
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.HOVER_BASIC)
  }

  const costName = `UNITS.${unit.costUnitId?.toString().toUpperCase()}.PLURAL`
  const isUpgradePurchased = useUpgradePurchased(unitId, 'autoprod')

  const quantityCost = getItemPrice(
    unit.costAmount ?? DEFAULT_TIME_PRICE,
    quantity
  )

  const timeCount = (duration: number) => (1 - duration / 5000) * 100

  const getActifUnit = getUnit(EGameUnit.ACTIF)
  if (!getActifUnit) return null

  const reactiveTimeCost = useMotionState(
    unit.motionValue,
    () => getItemPrice(DEFAULT_TIME_PRICE, timeCount(unit.duration?.get() ?? 1) || 1)
  )
  const reactiveCanPurchaseTime = useMotionState(getActifUnit.motionValue, () => canPurchaseTime(reactiveTimeCost, EGameUnit.ACTIF))
  const reactiveHasEnoughUnits = useMotionState(getActifUnit.motionValue, () => hasEnoughUnits(reactiveTimeCost, EGameUnit.ACTIF))
  const reactiveCanPurshaseQuantity = useMotionState(getActifUnit.motionValue, () => hasEnoughUnits(quantityCost, EGameUnit.ACTIF))

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.stepCounter }>
        <Count unitId={ unitId } count={ count } />
      </div>
      <HoldButton label='BUTTONS.COMPLEX' autoMode={ complexAutoMode } value={ quantity } />
      <div className={ styles.equivalence }>
        <div className={ styles.unitWrapper }>
          <p className={ styles.count }>1</p>
          <p className={ styles.unit }>{ l10n('UNITS.FORMULATION.SINGULAR') }</p>
        </div>
        <p className={ styles.equal }>=</p>
        <div className={ styles.unitWrapper }>
          <p className={ styles.count }>5</p>
          <p className={ styles.unit }>{ l10n(conjugate('UNITS.ACTIF', 5)) }</p>
        </div>
      </div>
      <div className={ styles.perfWrapper }>
        <div className={ styles.perf }>
          <div className={ styles.perfHeader }>
            <p className={ styles.perfTitle }>{ l10n('UI.PRODUCTION_DURATION') }</p>
            <span className={ styles.perfValue }>
              <MaskText opened={ false } replayKey={ formattedSeconds }>
                { formattedSeconds } { l10n('UNITS.SEC') }
              </MaskText>
            </span>
          </div>
          <Button
            variant='variant'
            onClick={ improveTime }
            disabled={ !reactiveHasEnoughUnits || !reactiveCanPurchaseTime }
            action={ `-${DEFAULT_SUBSTRACTION_VALUE / 1000} ${l10n('UNITS.SEC')}` }
            cost={{
              value: reactiveTimeCost,
              unit: l10n(costName)
            }}
          />
        </div>
        <div className={ styles.perf }>
          <div className={ styles.perfHeader }>
            <p className={ styles.perfTitle }>{ l10n('UI.EXECUTED_QUANTITY') }</p>
            <span className={ styles.perfValue }>
              <MaskText opened={ false } replayKey={ quantity }>
                { quantity }
              </MaskText>
            </span>
          </div>
          <Button
            disabled={ !reactiveCanPurshaseQuantity }
            variant='variant'
            cost={{
              value: quantityCost,
              unit: l10n(costName)
            }}
            action='+1'
            onClick={ () => improveValueByAction(
              EGameUnit.COMPLEX,
              EGameUnit.ACTIF
            ) }
          />
        </div>
      </div>
      { isUpgradePurchased && (
        <AutoSwitch
          value={ complexAutoMode }
          onToggle={ handleAutoSwitch }
        />
      ) }
    </div>
  )
}

export default ComplexSection
