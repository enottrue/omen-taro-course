import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component2.module.css";
import group4 from "../../images/group-4@2x.png";
import intro_lesson from "../../images/wath-the-wideo.png";

import { Button } from "../ui";
import { useState, useRef } from "react";

export type Component2Type = {
  className?: string;
  textShown?: boolean;
  headerText?: string;
  videoSource?: string;
  typePage?: 'mainPage' | 'courses';
};

const Component2: NextPage<Component2Type> = ({ className = "", textShown = true, videoSource = "/src/videos/video.mp4", typePage }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    if (isVideoPlaying) {
      // If video is already playing, stop it and show image
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsVideoPlaying(false);
    } else {
      // Start playing video
      setIsVideoPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          console.log('Auto-play was prevented:', error);
        });
      }
    }
  };

  // Determine heading text and image based on typePage
  let headingH1 = 'Welcome Video from';
  let headingH2 = 'Cosmo.Irena';
  let useNextImage = true;
  let nextImageSource = intro_lesson; // Default image for main page
  let publicImageSource = '/preview/main_page.png'; // Default public image
  
  if (typePage === 'mainPage') {
    headingH1 = 'Watch the';
    headingH2 = 'Intro Video';
    nextImageSource = intro_lesson; // wath-the-wideo.png for main page
    useNextImage = true;
  } else if (typePage === 'courses') {
    headingH1 = 'Welcome Video from';
    headingH2 = 'Cosmo.Irena';
    useNextImage = false;
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
        
        <div className={styles.videoContainer} style={{ position: 'relative', width: 260, height: 146 }}>
          {!isVideoPlaying ? (
            // Show image when video is not playing
            useNextImage ? (
              <Image
                className={styles.frameChild}
                loading="lazy"
                width={260}
                height={146}
                sizes="100vw"
                alt=""
                src={nextImageSource}
                onClick={handleVideoClick}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <img
                className={styles.frameChild}
                loading="lazy"
                width={260}
                height={146}
                alt=""
                src={publicImageSource}
                onClick={handleVideoClick}
                style={{ cursor: 'pointer' }}
              />
            )
          ) : (
            // Show video when playing
            <video
              ref={videoRef}
              className={styles.frameChild}
              width={260}
              height={146}
              controls
              autoPlay
              muted
              preload="auto"
              style={{ cursor: 'pointer' }}
              onClick={handleVideoClick}
              onEnded={() => setIsVideoPlaying(false)}
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

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
          {isVideoPlaying ? 'Stop Video' : 'Watch the Video'}
        </Button>
        )}
      </div>
    </section>
    </div>
  );
};

export default Component2;
