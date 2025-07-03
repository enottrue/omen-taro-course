import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component5.module.css";
import image31 from "../../images/image-3-1@2x.png";
import image4 from "../../images/image-4@2x.png";
import image5 from "../../images/image-5@2x.png";
import { Button } from "../ui";

export type Component5Type = {
  className?: string;
  onOpenAuthModal?: () => void;
};

const Component5: NextPage<Component5Type> = ({ className = "", onOpenAuthModal }) => {
  return (
    <section className={[styles.section, className].join(" ")}>
      <Image
        className={styles.image3Icon}
        width={382}
        height={154}
        sizes="100vw"
        alt=""
        src={image31}
        style={{ height: "auto" }}
      />
      <div className={styles.wrapperImage4}>
        <Image
          className={styles.image4Icon}
          loading="lazy"
          width={259}
          height={302}
          sizes="100vw"
          alt=""
          src={image4}
          style={{ height: "auto" }}
        />
      </div>
      <div className={styles.wrapperImage5}>
        <Image
          className={styles.image5Icon}
          width={352.5}
          height={376.5}
          sizes="100vw"
          alt=""
          src={image5}
          style={{ height: "auto" }}
        />
      </div>
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.whatYoullParent}>
            <h2 className={styles.whatYoull}>{`What You'll  `}</h2>
            <div className={styles.gainParent}>
              <h2 className={styles.gain}>{`Gain `}</h2>
              <h2 className={styles.after}>After</h2>
            </div>
            <h2 className={styles.after}>the Course:</h2>
          </div>
        </div>
        <div className={styles.theAbilityToReadYourFinanParent}>
          <div className={styles.theAbilityToContainer}>
            <p className={styles.theAbilityToReadYourFinan}>
              <span className={styles.theAbilityTo}>{`The ability to `}</span>
              <span>read your financial astrology</span>
              <span className={styles.theAbilityTo}>{` — `}</span>
            </p>
            <p className={styles.theAbilityToReadYourFinan}>
              for yourself and others
            </p>
          </div>
          <div className={styles.aClearListContainer}>
            <span>{`A `}</span>
            <span>{`clear list of career fields `}</span>
            <span>that align with your natural strengths</span>
          </div>
          <div className={styles.aDeeperUnderstandingContainer}>
            <span>{`A deeper understanding of `}</span>
            <span>how to earn more — sustainably</span>
          </div>
          <div className={styles.aDeeperUnderstandingContainer}>
            <span>{`The skill to `}</span>
            <span>forecast your money flow</span>
            <span> and take action with confidence</span>
          </div>
          <div className={styles.aClearListContainer}>
            <span>{`A way to `}</span>
            <span>see opportunities</span>
            <span>, not guess or rely on others</span>
          </div>
          <div className={styles.aClearListContainer}>
            <span>{`Tools to `}</span>
            <span>{`help friends, partners, and kids `}</span>
            <span>make better decisions</span>
          </div>
          <div className={styles.andASkill}>
            And a skill you'll use for life
          </div>
        </div>
      </div>
      <h3 className={styles.thisIsntLearnContainer}>
        <p className={styles.theAbilityToReadYourFinan}>{`This isn't `}</p>
        <p className={styles.theAbilityToReadYourFinan}>"learn and forget."</p>
      </h3>
      <div className={styles.thisIsA}>
        This is a course that gives you tools — and the ability to use them on
        your own.
      </div>
      <Button variant="enroll" onClick={onOpenAuthModal}>
        Enroll Now - only $50
      </Button>
    </section>
  );
};

export default Component5;
