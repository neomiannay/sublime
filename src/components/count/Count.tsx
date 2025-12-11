import classNames from 'classnames'
import { conjugate, useL10n } from 'provider/I18nProvider'
import { EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import { formatValue } from 'helpers/units'

import styles from './Count.module.scss'

type CountProps = {
  className?: string
  unitId: EGameUnit
  count: number
}

const Count = ({ className, unitId, count, ...props }: CountProps) => {
  const l10n = useL10n()
  const { getUnit, canBuyUnit, buyUnit } = useGameProviderContext()

  const unitName = `UNITS.${unitId.toString().toUpperCase()}`

  const saleUnit = getUnit(EGameUnit.SALE)
  const unit = getUnit(unitId)
  if (!saleUnit || !unit) return null
  const tripleSections = saleUnit.displayCondition

  let alignItems
  if (tripleSections) {
    switch (unitId) {
      case EGameUnit.ACTIF:
        alignItems = 'flex-start'
        break
      case EGameUnit.SALE:
        alignItems = 'flex-end'
        break
      default:
        alignItems = 'center'
        break
    }
  }

  return (
    <div
      className={ classNames(styles.wrapper, className) } { ...props }
      style={{ alignItems }}
    >
      <span className={ styles.count }>{ formatValue(count) }</span>
      <span className={ styles.title }>{ l10n(conjugate(unitName, count)) }</span>
    </div>
  )
}

export default Count
