import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component8.module.css";
import image31 from "../../images/image-3-1@2x.png";
import clarityStatements from "../../images/clarity-statements@3x.png";
import clarityStatements1 from "../../images/clarity-statements1@3x.png";
import clarityStatements2 from "../../images/clarity-statements2@3x.png";
import clarityStatements3 from "../../images/clarity-statements3@3x.png";

export type AudienceAlignmentType = {
  className?: string;
};

const AudienceAlignment: NextPage<AudienceAlignmentType> = ({
  className = "",
}) => {
  return (
    <section className={[styles.audienceAlignment, className].join(" ")}>
      <div className={styles.suitableTarget}>
        <div className={styles.idealProfile}>
          <div className={styles.courseCompatibility}>
            <div className={styles.financialIntention}>
              <h2 className={styles.thisCourseIs}>This Course Is</h2>
              <h2 className={styles.forYouIf}>for You If:</h2>
            </div>
          </div>
          <div className={styles.clarityStatementsParent}>
            <div className={styles.clarityStatementsWrapper}>
              <Image
                className={styles.clarityStatementsBg}
                src={clarityStatements}
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
              <div className={styles.courseCompatibility}>
                <b className={styles.youWantFinancial}>
                  You want financial clarity and confidence
                </b>
              </div>
            </div>
            <div className={styles.clarityStatementsWrapper}>
              <Image
                className={styles.clarityStatementsBg}
                src={clarityStatements1}
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
              <div className={styles.courseCompatibility}>
                <b className={styles.youWantFinancial}>
                  <span className={styles.youreDoneDependingContainer1}>
                    <p
                      className={styles.youreDoneDepending}
                    >{`You're done depending `}</p>
                    <p className={styles.youreDoneDepending}>
                      on outside advice
                    </p>
                  </span>
                </b>
              </div>
            </div>
            <div className={styles.clarityStatementsWrapper}>
              <Image
                className={styles.clarityStatementsBg}
                src={clarityStatements2}
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
              <div className={styles.courseCompatibility}>
                <b className={styles.youWantFinancial}>
                  <span className={styles.youreDoneDependingContainer1}>
                    <p
                      className={styles.youreDoneDepending}
                    >{`You're ready to choose `}</p>
                    <p
                      className={styles.youreDoneDepending}
                    >{`with confidence `}</p>
                    <p className={styles.youreDoneDepending}>
                      and self-awareness
                    </p>
                  </span>
                </b>
              </div>
            </div>
            <div className={styles.clarityStatementsWrapper}>
              <Image
                className={styles.clarityStatementsBg}
                src={clarityStatements3}
                alt=""
                fill
                style={{ objectFit: "cover" }}
              />
              <div className={styles.courseCompatibility}>
                <b className={styles.youreAstrologyCuriousButContainer}>
                  <span className={styles.youreDoneDependingContainer1}>
                    <p
                      className={styles.youreDoneDepending}
                    >{`You're astrology-curious `}</p>
                    <p className={styles.youreDoneDepending}>
                      but have zero experience (that's okay!)
                    </p>
                  </span>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        className={styles.image3Icon}
        loading="lazy"
        width={380.7}
        height={154}
        sizes="100vw"
        alt=""
        src={image31}
        style={{ height: "auto" }}
      />
    </section>
  );
};

export default AudienceAlignment;
