import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component7.module.css";
import vzroslyiImage from "../../images/vzroslyiderzitsarsveta-1@2x.png";

export type Component7Type = {
  className?: string;
};

const Component7: NextPage<Component7Type> = ({ className = "" }) => {
  return (
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.instructorInfo}>
        <div className={styles.astrologerDetails}>
          <h2 className={styles.aboutThe}>About the</h2>
          <h2 className={styles.instructor}>Instructor:</h2>
        </div>
        <Image
          className={styles.vzroslyiDerzitSarSveta1Icon}
          loading="lazy"
          width={260}
          height={260}
          sizes="100vw"
          alt=""
          src={vzroslyiImage}
        />
        <div className={styles.expertiseGuidance}>
          <div className={styles.professionalAstrologerWith}>
            Professional astrologer with 30+ years of experience
          </div>
          <div className={styles.instructorDetails}>
            <div className={styles.guidanceInfo}>
              <h2 className={styles.featuresSummary}>*</h2>
            </div>
            <div className={styles.clearStraightforwardGuidanc}>
              Clear, straightforward guidance — no confusing jargon or mysticism
            </div>
          </div>
          <div className={styles.instructorDetails}>
            <div className={styles.guidanceInfo}>
              <h2 className={styles.featuresSummary}>*</h2>
            </div>
            <div className={styles.clearStraightforwardGuidanc}>
              50,000+ clients worldwide
            </div>
          </div>
          <div className={styles.instructorDetails}>
            <div className={styles.guidanceInfo}>
              <h2 className={styles.featuresSummary}>*</h2>
            </div>
            <div className={styles.clearStraightforwardGuidanc}>
              Private sessions with clients from all over the world
            </div>
          </div>
          <div className={styles.instructorDetails}>
            <div className={styles.guidanceInfo}>
              <h2 className={styles.featuresSummary}>*</h2>
            </div>
            <div className={styles.clearStraightforwardGuidanc}>
              Creator of proven methods used by 10,000+ people
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Component7;
