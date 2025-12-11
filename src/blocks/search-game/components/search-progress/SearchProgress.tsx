import React, { useRef } from 'react'

import GradientText from 'components/gradient-text/GradientText'
import { useL10n } from 'provider/I18nProvider'
import { timeToHHMMSS } from 'helpers/units'
import Translatable from 'components/translatable/Translatable'

import styles from './SearchProgress.module.scss'

export type SearchProgressProps = {
  colors: {
    background: string;
    progress: string;
  };
  currentTime: number;
};

const SearchProgress = ({
  colors,
  currentTime
}: SearchProgressProps) => {
  const l10n = useL10n()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const progressPath =
    'M299.5 150C299.5 130.367 295.633 110.927 288.12 92.7888C280.607 74.6507 269.595 58.1699 255.712 44.2876C241.83 30.4052 225.349 19.3931 207.211 11.88C189.073 4.36694 169.633 0.500003 150 0.5C130.367 0.499997 110.927 4.36693 92.7888 11.88C74.6507 19.3931 58.1699 30.4052 44.2875 44.2875C30.4052 58.1699 19.3931 74.6506 11.88 92.7888C4.36694 110.927 0.500002 130.367 0.5 150C0.499998 169.633 4.36693 189.073 11.88 207.211C19.3931 225.349 30.4052 241.83 44.2875 255.712C58.1699 269.595 74.6506 280.607 92.7888 288.12C110.927 295.633 130.367 299.5 150 299.5C169.633 299.5 189.073 295.633 207.211 288.12C225.349 280.607 241.83 269.595 255.712 255.712C269.595 241.83 280.607 225.349 288.12 207.211C295.633 189.073 299.5 169.633 299.5 150L299.5 150Z'

  return (
    <div className={ styles.wrapper } ref={ wrapperRef }>
      <div className={ styles.progressWrapper }>
        <svg
          width='300'
          height='300'
          viewBox='0 0 300 300'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <style>
            { `
              @keyframes rotate {
                0% {
                  transform: rotate(0deg);
                  stroke-dasharray: 300 1000;
                }
                50% {
                  stroke-dasharray: 600 1000;
                }
                100% {
                  transform: rotate(360deg);
                  stroke-dasharray: 300 1000;
                }
              }
            ` }
          </style>
          <mask
            id='mask0_1694_4000'
            style={{ maskType: 'alpha' }}
            maskUnits='userSpaceOnUse'
            x='0'
            y='0'
            width='300'
            height='300'
          >
            <circle cx='150' cy='150' r='150' fill='#fff' />
          </mask>
          <g mask='url(#mask0_1694_4000)'>
            <mask
              id='mask1_1694_4000'
              style={{ maskType: 'alpha' }}
              maskUnits='userSpaceOnUse'
              x='0'
              y='0'
              width='300'
              height='300'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M300 0H0V300H300V0ZM150 251.835C206.242 251.835 251.835 206.242 251.835 150C251.835 93.7582 206.242 48.1651 150 48.1651C93.7582 48.1651 48.1651 93.7582 48.1651 150C48.1651 206.242 93.7582 251.835 150 251.835Z'
                fill='#fff'
              />
            </mask>
            <g mask='url(#mask1_1694_4000)'>
              <path
                d={ progressPath }
                stroke={ colors.progress }
                strokeOpacity={ 1 }
                filter='blur(25px)'
                strokeWidth={ 40 }
                style={{
                  animation: 'rotate 6s linear infinite',
                  transformOrigin: 'center'
                }}
              />
            </g>
            <path d={ progressPath } stroke='#07074E' strokeWidth='0' />
          </g>
          <circle
            cx='150.001'
            cy='149.999'
            r='101.835'
            stroke={ colors.progress }
            strokeWidth='2'
            strokeDasharray='9.63 9.63'
            style={{
              strokeLinecap: 'round',
              filter: 'blur(10px)',
              transformOrigin: 'center'
            }}
          />
        </svg>
      </div>
      <div className={ styles.container }>
        <div className={ styles.inProgressWrapper }>
          <Translatable parentRef={ wrapperRef } distance={ 10 } stiffness={ 200 }>
            <GradientText startColor='var(--fill-20)' endColor='var(--transparent-light-40)'>
              <p className={ styles.inProgressContainer }>
                <small className={ styles.inProgress }>
                  { l10n('SEARCH_ACTIFS.LAYOUT.IN_PROGRESS') }
                </small>
                <br />
                <small className={ styles.inProgress }>
                  { `(${timeToHHMMSS(currentTime)})` }
                </small>
              </p>
            </GradientText>
          </Translatable>
        </div>
      </div>
    </div>
  )
}
export default SearchProgress
