import React from 'react'

import classNames from 'classnames'
import { motion } from 'framer-motion'
import MaskText from 'components/mask-text/MaskText'
import { useL10n } from 'provider/I18nProvider'
import { bezier } from 'helpers/easing'

import styles from './AutoSwitch.module.scss'

type AutoSwitchProps = {
  value: boolean;
  onToggle: () => void;
};

const AutoSwitch: React.FC<AutoSwitchProps> = ({ value, onToggle }) => {
  const l10n = useL10n()

  return (
    <motion.div
      className={ styles.autoSwitch }
      onClick={ onToggle }
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.3, ease: bezier.quintEaseOut }}
    >
      <div className={ styles.switchLabel }>
        <MaskText opened={ false } replayKey={ value ? 1 : 0 }>
          { l10n('UI.AUTOMATIC_PRODUCTION') }
        </MaskText>
      </div>
      <div className={ classNames(styles.switchTrack, { [styles.on]: value }) }>
        <div className={ styles.switchThumb } />
      </div>
    </motion.div>
  )
}

export default AutoSwitch
