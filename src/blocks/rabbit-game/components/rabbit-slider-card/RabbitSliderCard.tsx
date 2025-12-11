import React from 'react'

import { useL10n } from 'provider/I18nProvider'
import { EGamePrice, EGameUnit } from 'types/store'
import { useMotionValue } from 'motion/react'
import classNames from 'classnames'

import { TRabbitSliderItem } from '../rabbit-slider/RabbitSlider'
import RabbitHp from '../rabbit-hp/RabbitHp'

import styles from './RabbitSliderCard.module.scss'

type TRabbitSliderCardProps = {
  item: TRabbitSliderItem;
  isRabbitDead: boolean;
  price: number | null;
};

const RabbitSliderCard = ({ item, isRabbitDead, price }: TRabbitSliderCardProps) => {
  const l10n = useL10n()
  const life = useMotionValue(item.power)

  const targetLabels: Record<string, string> = {
    [EGamePrice.PRODUCTION]: l10n('UI.PRODUCTION_COST'),
    [EGamePrice.SELLING]: l10n('UI.SELLING'),
    [EGameUnit.REPUTATION]: l10n('UI.REPUTATION')
  }

  return (
    <div className={ classNames(styles.card, {
      [styles.cardDead]: isRabbitDead
    }) }
    >
      <div className={ styles.cardInformation }>
        { isRabbitDead && (
          <img src='img/rabbit/dead_rabbit_logo.png' className={ styles.deadRabbitLogo } alt='' />
        ) }
        <div className={ styles.cardHeader }>
          <h3 className={ styles.cardTitle }>{ l10n(item.name) }</h3>
          { !isRabbitDead && (
            <RabbitHp className={ styles.cardHp } life={ life } length={ 6 } reduce />
          ) }
        </div>
        <p className={ styles.cardDescription }>{ l10n(item.description) }</p>
      </div>
      <div className={ styles.valuesContainer }>
        { !isRabbitDead && (
          <div className={ styles.cardValues }>
            { item.values
              .filter((value) => value.target !== EGameUnit.KARMA)
              .map((value) => (
                <div key={ value.target } className={ styles.cardValuesItem }>
                  <h5 className={ styles.cardValuesTitle }>{ targetLabels[value.target] ?? value.target }</h5>
                  <h6 className={ styles.cardValuesLabel }>
                    +
                    { value.value.toString() }
                    { value.target === EGameUnit.REPUTATION
                      ? l10n('UNITS.PERCENT')
                      : l10n('UNITS.EURO') }
                  </h6>
                </div>
              )) }
          </div>
        ) }
        <div className={ styles.cardValuesItem }>
          <h5 className={ styles.cardValuesTitle }>{ l10n('RABBIT_GAME.LAYOUT.COST') }</h5>
          <h6 className={ styles.cardValuesLabel }>
            { price && (price.toLocaleString()) }
            { l10n('UNITS.EURO') }
          </h6>
        </div>
      </div>
    </div>
  )
}

export default RabbitSliderCard
