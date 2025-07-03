import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component2.module.css";
import group4 from "../../images/group-4@2x.png";
import { Button } from "../ui";
import { useState } from "react";
import VideoModal from "../video_modal/VideoModal";

export type Component2Type = {
  className?: string;
};

const Component2: NextPage<Component2Type> = ({ className = "" }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleVideoClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.watchTheParent}>
            <h1 className={styles.watchThe}>{`Watch the `}</h1>
            <h2 className={styles.introVideo}>Intro Video</h2>
          </div>
          <div className={styles.whyICreatedContainer}>
            <span className={styles.whyICreated}>
              Why I created this course —
            </span>
            <span>
              {" "}
              and how it can completely shift your view on money, work, and your
              purpose.
            </span>
          </div>
        </div>
        <Image
          className={styles.frameChild}
          loading="lazy"
          width={260}
          height={146}
          sizes="100vw"
          alt=""
          src={group4}
          onClick={handleVideoClick}
          style={{ cursor: 'pointer' }}
        />
        
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
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseModal}
        videoSrc="/videos/video1.mp4"
      />
    </section>
  );
};

export default Component2;
