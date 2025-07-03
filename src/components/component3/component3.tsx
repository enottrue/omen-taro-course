import type { NextPage } from "next";
import styles from "./component3.module.css";

export type Component3Type = {
  className?: string;
};

const Component3: NextPage<Component3Type> = ({ className = "" }) => {
  return (
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.rectangleParent}>
        <div className={styles.frameChild} />
        <div className={styles.idealMoneyPath}>
          <div className={styles.frameParent}>
            <div className={styles.frameWrapper}>
              <div className={styles.frameContainer}>
                <div className={styles.pathSeparatorsWrapper}>
                  <h3 className={styles.pathSeparators}>01</h3>
                </div>
              </div>
            </div>
            <div className={styles.pathDescriptionInternalWrapper}>
              <div className={styles.pathDescriptionInternal}>
                <div className={styles.pathDescriptionInner}>
                  <h3 className={styles.pathSeparators}>
                    Your Ideal Money Path
                  </h3>
                  <div className={styles.discoverWhereYour}>
                    Discover where your biggest income potential lies — based on
                    your chart.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frameParent}>
            <div className={styles.frameParent}>
              <div className={styles.frameWrapper1}>
                <div className={styles.pathSeparatorsWrapper}>
                  <h3 className={styles.pathSeparators}>02</h3>
                </div>
              </div>
            </div>
            <div className={styles.pathDescriptionInternalWrapper}>
              <div className={styles.pathDescriptionInternal}>
                <div className={styles.pathDescriptionInner}>
                  <h3 className={styles.pathSeparators}>
                    Activate Your Money Flow
                  </h3>
                  <div className={styles.discoverWhereYour}>
                    Learn the exact steps (and perfect timing) to attract
                    wealth, save wisely, and stop financial leaks.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frameParent}>
            <div className={styles.frameParent}>
              <div className={styles.frameWrapper5}>
                <div className={styles.pathSeparatorsWrapper}>
                  <h3 className={styles.pathSeparators}>03</h3>
                </div>
              </div>
            </div>
            <div className={styles.pathDescriptionInternalWrapper}>
              <div className={styles.pathDescriptionInternal}>
                <div className={styles.pathDescriptionInner}>
                  <h3 className={styles.pathSeparators}>Quick Income Wins</h3>
                  <div className={styles.discoverWhereYour}>
                    Spot easy income sources for immediate needs - vacations,
                    gifts or unexpected expenses.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frameParent}>
            <div className={styles.frameParent}>
              <div className={styles.frameWrapper9}>
                <div className={styles.pathSeparatorsWrapper}>
                  <h3 className={styles.pathSeparators}>04</h3>
                </div>
              </div>
            </div>
            <div className={styles.pathDescriptionInternalWrapper}>
              <div className={styles.pathDescriptionInternal}>
                <div className={styles.pathDescriptionInner}>
                  <h3 className={styles.pathSeparators}>
                    Burnout-Proof Work Life 
                  </h3>
                  <div className={styles.discoverWhereYour}>
                    Discover what work conditions will keep you energized rather
                    than exhausted.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frameParent}>
            <div className={styles.frameParent}>
              <div className={styles.frameWrapper13}>
                <div className={styles.pathSeparatorsWrapper}>
                  <h3 className={styles.pathSeparators}>05</h3>
                </div>
              </div>
            </div>
            <div className={styles.pathDescriptionInternalWrapper}>
              <div className={styles.pathDescriptionInternal}>
                <div className={styles.pathDescriptionInner}>
                  <h3 className={styles.pathSeparators}>
                    Your Personal Money Forecast
                  </h3>
                  <div className={styles.discoverWhereYour}>
                    Master creating yearly financial predictions - for yourself
                    and loved ones.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frameItem} />
        <div className={styles.whatsInsideParent}>
          <h2 className={styles.whatsInside}>What’s Inside</h2>
          <h2 className={styles.theCourse}> the Course:</h2>
        </div>
      </div>
    </section>
  );
};

export default Component3;
