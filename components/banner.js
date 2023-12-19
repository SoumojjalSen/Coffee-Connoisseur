import React from 'react'
import styles from './static_css/Banner.module.css'
import { Pattaya } from 'next/font/google'

const Banner = (props) => {

return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span className={styles.title1} >Coffee</span>
        <span className={styles.title2}>Connoisseur</span>
      </div>
      <p className={styles.subTitle}>
          Discover your local coffee shops
      </p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={props.handleOnClick}>
          {props.buttonText}
        </button>
      </div>    
    </div>
  )
}

export default Banner