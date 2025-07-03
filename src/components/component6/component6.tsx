import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component6.module.css";
import unsplashImage2 from "../../images/unsplashutbx9x3y8ly-2@2x.png";
import TestimonialsSlider from "../testimonials-slider/TestimonialsSlider";

export type Component6Type = {
  className?: string;
};

const Component6: NextPage<Component6Type> = ({ className = "" }) => {
  return (
    <section className={[styles.section, className].join(" ")}>
      <Image
        className={styles.unsplashutbx9x3y8lyIcon}
        width={320}
        height={509}
        sizes="100vw"
        alt=""
        src={unsplashImage2}
      />
      <div className={styles.frameParent}>
        <div className={styles.whatStudentsParent}>
          <h2 className={styles.whatStudents}>What Students</h2>
          <h2 className={styles.say}> Say:</h2>
        </div>
        <div className={styles.frameGroup}>
          <TestimonialsSlider />
        </div>
      </div>
      <div className={styles.reviewsInfo}>
        <div className={styles.over10000WomenParent}>
          <h3 className={styles.over10000Women}>Over 10,000 women</h3>
          <div className={styles.haveAlreadyTakenContainer}>
            <p
              className={styles.haveAlreadyTaken}
            >{`have already taken this course. `}</p>
            <p className={styles.haveAlreadyTaken}>And it works.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Component6;
