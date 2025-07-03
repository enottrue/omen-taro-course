"use client";
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./comparison-details.module.css";

export type ComparisonDetailsType = {
  className?: string;
  image: string | StaticImageData;

  /** Style props */
  privateAstrologyReadingContainerWidth?: CSSProperties["width"];
  privateAstrologyReadingContainerDisplay?: CSSProperties["display"];
};

const ComparisonDetails: NextPage<ComparisonDetailsType> = ({
  className = "",
  image,
  privateAstrologyReadingContainerWidth,
  privateAstrologyReadingContainerDisplay,
}) => {
  const privateAstrologyReadingContainerStyle: CSSProperties = useMemo(() => {
    return {
      width: privateAstrologyReadingContainerWidth,
      display: privateAstrologyReadingContainerDisplay,
    };
  }, [
    privateAstrologyReadingContainerWidth,
    privateAstrologyReadingContainerDisplay,
  ]);

  return (
    <div className={[styles.comparisonDetails, className].join(" ")}>
      <div className={styles.rectangleParent}>
        <div className={styles.frameChild} />
        <Image
          className={styles.imageIcon}
          loading="lazy"
          width={66}
          height={66}
          sizes="100vw"
          alt=""
          src={image}
        />
      </div>
      <div
        className={styles.privateAstrologyReadingContainer}
        style={privateAstrologyReadingContainerStyle}
      >
        <span>{`Private astrology reading: `}</span>
        <span>typically $150+</span>
      </div>
    </div>
  );
};

export default ComparisonDetails;
