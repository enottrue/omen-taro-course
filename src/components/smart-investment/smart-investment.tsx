import type { NextPage } from "next";
import Image from "next/image";
import FrameComponent from "../framecomponent/frame-component";
import FamilyBenefits from "../family-benefits/family-benefits";
import styles from "./smart-investment.module.css";
import image6 from "../../images/image-6@2x.png";
import group6 from "../../images/group-6@2x.png";
import group7 from "../../images/group-7@2x.png";

export type SmartInvestmentType = {
  className?: string;
  onOpenRegisterModal?: () => void;
};

const SmartInvestment: NextPage<SmartInvestmentType> = ({ className = "", onOpenRegisterModal }) => {
  return (
    <section className={[styles.smartInvestment, className].join(" ")}>
      <Image
        className={styles.image6Icon}
        loading="lazy"
        width={149.6}
        height={72}
        sizes="100vw"
        alt=""
        src={image6}
      />
      <FrameComponent />
      <Image
        className={styles.smartInvestmentChild}
        loading="lazy"
        width={101.2}
        height={108.1}
        sizes="100vw"
        alt=""
        src={group6}
      />
      <Image
        className={styles.smartInvestmentItem}
        loading="lazy"
        width={103.7}
        height={110.1}
        sizes="100vw"
        alt=""
        src={group7}
      />
      <FamilyBenefits onOpenRegisterModal={onOpenRegisterModal} />
    </section>
  );
};

export default SmartInvestment; 