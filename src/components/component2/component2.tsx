import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component2.module.css";
import group4 from "../../images/group-4@2x.png";
import intro_lesson from "../../../public/preview/00.png";

import { Button } from "../ui";
import { useState } from "react";
import VideoModal from "../video_modal/VideoModal";

export type Component2Type = {
  className?: string;
  textShown?: boolean;
  headerText?: string;
  videoSource?: string;
  typePage?: 'mainPage' | 'courses';
};

const Component2: NextPage<Component2Type> = ({ className = "", textShown = true, videoSource = "/videos/video.mp4", typePage }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleVideoClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
  };

  // Determine heading text based on typePage
  let headingH1 = 'Welcome Video from';
  let headingH2 = 'Cosmo.Irena';
  if (typePage === 'mainPage') {
    headingH1 = 'Watch the';
    headingH2 = 'Intro Video';
  }

  return (
    <div>
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.watchTheParent}>
            <h1 className={styles.watchThe}>{headingH1}</h1>
            <h2 className={styles.introVideo}>{headingH2}</h2>
          </div>
          {textShown && <div className={styles.whyICreatedContainer}>
            <span className={styles.whyICreated}>
              Why I created this course —
            </span>
            <span>
              {" "}
              and how it can completely shift your view on money, work, and your
              purpose.
            </span>
          </div>}
        </div>
        <Image
          className={styles.frameChild}
          loading="lazy"
          width={260}
          height={146}
          sizes="100vw"
          alt=""
          src={intro_lesson}
          onClick={handleVideoClick}
          style={{ cursor: 'pointer' }}
        />
        {textShown && (
        <Button 
          variant="video" 
          icon={
            <img
              width={11.3}
              height={11.3}
              alt=""
              src="/images/group-3.svg"
            />
          }
          onClick={handleVideoClick}
        >
          Watch the Video
        </Button>
        )}
      </div>


    </section>
          <VideoModal
          isOpen={isVideoModalOpen}
          onClose={handleCloseModal}
          videoSrc={videoSource}
        />
    </div>
  );
};

export default Component2;
