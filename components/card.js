import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './static_css/Card.module.css'
import ClassNames from 'classnames'

const Card = (props) => { 
  return (
    <Link href={props.href} className={styles.cardLink}>
      <div className={ClassNames("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{props.name}</h2>  {/* name of the coffee store */}
        </div>
        <div className={styles.cardImageWrapper}>
          <Image 
            className={styles.cardImage}  
            src={props.imgUrl}
            width={300}   
            height={300}
            alt='coffee shop photo'
          />
        </div>  
      </div>  
    </Link>  
  )
}

export default Card  