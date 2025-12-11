import React, { useMemo, useState } from 'react'

import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { useL10n } from 'provider/I18nProvider'
import useMotionState from 'hooks/useMotionState'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { EGameUnit } from 'types/store'
import useElementPurchased from 'hooks/useElementPurchased'

import rabbits from 'data/games/rabbits.json'

import styles from './RabbitGame.module.scss'
import Rabbit from './components/rabbit/Rabbit'
import RabbitSlider, { TRabbitSliderItem } from './components/rabbit-slider/RabbitSlider'

export type TRabbitData = {
  price: number;
};

const RabbitGame = () => {
  const l10n = useL10n()
  const life = useMotionValue<number>(6)
  const { rabbitPrice, setRabbitPrice } = useSearchLaboratoryContext()

  const [currentExp, setCurrentExp] = useState<TRabbitSliderItem | null>(null)

  const isRabbitDead = useMotionState(life, (v) => v <= 0)

  const attack = useMemo(() => currentExp?.power ?? 0, [currentExp])

  const isRabbitGamePurchased = useElementPurchased(EGameUnit.SALE, 'rabbitGame', 'otherShopElement')

  return (
    <div className={ styles.wrapper }>
      <AnimatePresence mode='wait'>
        { isRabbitGamePurchased ? (
          <motion.div
            key='game'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={ styles.name }>{ l10n('RABBIT_GAME.LAYOUT.NAME') }</h3>
            <hr className={ styles.divider } />
            <Rabbit
              life={ life }
              price={ rabbitPrice }
              attack={ attack }
              isRabbitDead={ isRabbitDead }
            />
            <RabbitSlider
              items={ rabbits.items as TRabbitSliderItem[] }
              setCurrentExp={ setCurrentExp }
              isRabbitDead={ isRabbitDead }
              life={ life }
              rabbitPrice={ rabbitPrice }
              testPrice={ rabbits.testPrice }
              setRabbitPrice={ setRabbitPrice }
            />
          </motion.div>
        ) : (
          <motion.img
            key='blur'
            src='/img/rabbit/rabbit_blur.png'
            alt=''
            className={ styles.rabbitBlur }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ) }
      </AnimatePresence>
    </div>
  )
}

export default RabbitGame
