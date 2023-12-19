import React from "react";
import styles from "./static_css/Banner.module.css";
import Image from "next/image";
import { Pattaya } from "next/font/google";

const Banner = (props) => {
  return (
    <div className={styles.super_container}>
      <div className={styles.container}>
        <div className={styles.title}>
          <span className={styles.title1}>Coffee</span>
          <span className={styles.title2}>Connoisseur</span>
        </div>
        <p className={styles.subTitle}>Discover your local coffee shops</p>
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={props.handleOnClick}>
            {props.buttonText}
          </button>
        </div>
      </div>
      <div className={styles.heroImage}>
        <Image
          src="/static/Hero-image.png"
          priority
          fill
          alt="coffee shop photo"
        />
      </div>
    </div>
  );
};

export default Banner;
