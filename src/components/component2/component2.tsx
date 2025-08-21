import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component2.module.css";
import group4 from "../../images/group-4@2x.png";
import intro_lesson from "../../images/wath-the-wideo.png";

import { Button } from "../ui";
import { useState, useRef, useEffect } from "react";
import { useGoogleAnalytics } from "../../hooks/useGoogleAnalytics";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

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
  const { trackVideoImpression, trackEvent, trackVideoStart, trackVideoProgress } = useGoogleAnalytics();
  
  // Отслеживание видимости видео блока (50% и более)
  const { elementRef: videoBlockRef, hasTriggered } = useIntersectionObserver({
    threshold: 0.5
  });

  // Отправляем событие в Google Analytics когда видео блок становится видимым
  useEffect(() => {
    if (hasTriggered && typePage === 'mainPage') {
      const videoTitle = "Money Compass Intro";
      const videoProvider = "HTML5 Video";
      const videoUrl = videoSource || "/videos/main_page.mp4";
      
      trackVideoImpression(videoTitle, videoProvider, videoUrl);
    }
  }, [hasTriggered, typePage, trackVideoImpression, videoSource]);

  // Отслеживание прогресса видео
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    if (duration > 0) {
      const percent = (currentTime / duration) * 100;
      
      // Контрольные точки: 10%, 25%, 50%, 75%, 90%
      const checkpoints = [10, 25, 50, 75, 90];
      
      checkpoints.forEach(checkpoint => {
        if (percent >= checkpoint && percent < checkpoint + 1) {
          // Отправляем событие только один раз для каждой контрольной точки
          const key = `checkpoint_${checkpoint}`;
          if (!video.dataset[key]) {
            video.dataset[key] = 'true';
            trackVideoProgress(checkpoint, currentTime);
          }
        }
      });
    }
  };

  const handleVideoClick = () => {
    // Отслеживаем клик по кнопке Watch the Video или по изображению видео
    if (typePage === 'mainPage') {
      trackEvent('video_cta_click', {
        button_text: 'Watch the Video',
        button_position: 'video_section'
      });
    }

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
        // Enable sound and play video
        videoRef.current.muted = false;
        videoRef.current.play().catch(error => {
          console.log('Auto-play was prevented:', error);
        });
      }
    }
  };

  // Отдельная функция для отслеживания клика по изображению
  const handleImageClick = () => {
    if (typePage === 'mainPage') {
      trackEvent('video_cta_click', {
        button_text: 'Video Preview Image',
        button_position: 'video_section'
      });
    }
    handleVideoClick();
  };

  // Отслеживание запуска видео
  const handleVideoPlay = () => {
    if (videoRef.current && typePage === 'mainPage') {
      const video = videoRef.current;
      const videoTitle = "Money Compass Intro";
      const videoDuration = video.duration || 0;
      const autoplay = false; // Видео запускается по клику, не автоплей
      
      trackVideoStart(videoTitle, videoDuration, autoplay);
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
        
        <div 
          ref={videoBlockRef}
          className={styles.videoContainer} 
          style={{ position: 'relative', width: 260, height: 146 }}
        >
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
                onClick={handleImageClick}
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
                onClick={handleImageClick}
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
              preload="auto"
              style={{ cursor: 'pointer' }}
              onClick={handleVideoClick}
              onEnded={() => setIsVideoPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handleVideoPlay}
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
