import type { NextPage } from "next";
import Image from "next/image";
import styles from "./component2.module.css";
import group4 from "../../images/group-4@2x.png";
import intro_lesson from "../../images/wath-the-wideo.png";

import { Button } from "../ui";
import { useState, useRef, useEffect } from "react";
import { useGoogleAnalytics } from "../../hooks/useGoogleAnalytics";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useMetrica } from 'next-yandex-metrica';

export type Component2Type = {
  className?: string;
  textShown?: boolean;
  headerText?: string;
  videoSource?: string;
  typePage?: 'mainPage' | 'courses';
};

const Component2: NextPage<Component2Type> = ({ className = "", textShown = true, videoSource = "/src/videos/video.mp4", typePage }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { 
    trackVideoImpression, 
    trackEvent, 
    trackVideoStart, 
    trackVideoProgress,
    trackVideoPause,
    trackVideoSeek,
    trackVideoMute,
    trackVideoComplete,
    trackVideoError,
    testGoal,
    trackVideoCTA
  } = useGoogleAnalytics();
  
  const { reachGoal } = useMetrica();
  
  // Состояние для отслеживания паузы
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [lastSeekTime, setLastSeekTime] = useState<number>(0);
  
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
            
            // Send Yandex Metrica event for intro video progress
            reachGoal('intro_video_progress', { 
              progress: checkpoint,
              currentTime: currentTime,
              videoTitle: "Money Compass Intro"
            });
          }
        }
      });

      // Проверяем завершение видео (≥95%)
      if (percent >= 95 && !video.dataset.completed) {
        video.dataset.completed = 'true';
        trackVideoComplete(duration);
        
        // Send Yandex Metrica event for intro video completion
        reachGoal('intro_video_completed', { 
          duration: duration,
          videoTitle: "Money Compass Intro"
        });
      }
    }
  };

  // Отслеживание паузы
  const handlePause = () => {
    if (videoRef.current && typePage === 'mainPage') {
      const video = videoRef.current;
      const currentTime = video.currentTime;
      const duration = video.duration;
      const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      // Обновляем состояние воспроизведения
      setIsVideoPaused(true);
      setIsVideoPlaying(false);
      setPauseStartTime(Date.now());
      trackVideoPause(currentTime, percent);
    }
  };

  // Отслеживание возобновления воспроизведения
  const handlePlay = () => {
    if (videoRef.current && typePage === 'mainPage') {
      const video = videoRef.current;
      const videoTitle = "Money Compass Intro";
      const videoDuration = video.duration || 0;
      const autoplay = false; // Видео запускается по клику, не автоплей
      
      // Обновляем состояние воспроизведения
      setIsVideoPaused(false);
      setIsVideoPlaying(true);
      setHasVideoStarted(true);
      
      // Проверяем длительность паузы
      if (pauseStartTime) {
        const pauseDuration = Date.now() - pauseStartTime;
        // Если пауза была больше 2 секунд, это уже отслежено в handlePause
        setPauseStartTime(null);
      }
      
      trackVideoStart(videoTitle, videoDuration, autoplay);
      
      // Send Yandex Metrica event for intro video start
      reachGoal('intro_video_started', { 
        videoTitle: videoTitle,
        videoDuration: videoDuration,
        autoplay: autoplay
      });
    }
  };

  // Отслеживание перемотки
  const handleSeeked = () => {
    if (videoRef.current && typePage === 'mainPage') {
      const video = videoRef.current;
      const currentTime = video.currentTime;
      
      // Отправляем событие только если перемотка была значительной (>1 секунды)
      if (Math.abs(currentTime - lastSeekTime) > 1) {
        trackVideoSeek(lastSeekTime, currentTime);
        setLastSeekTime(currentTime);
      }
    }
  };

  // Отслеживание изменения звука
  const handleVolumeChange = () => {
    if (videoRef.current && typePage === 'mainPage') {
      const video = videoRef.current;
      const isMuted = video.muted;
      trackVideoMute(isMuted);
    }
  };

  // Отслеживание ошибок видео
  const handleError = () => {
    if (videoRef.current && typePage === 'mainPage') {
      const video = videoRef.current;
      let errorCode = 'unknown';
      let errorMessage = 'Unknown video error';
      
      if (video.error) {
        switch (video.error.code) {
          case 1:
            errorCode = 'MEDIA_ERR_ABORTED';
            errorMessage = 'Video playback was aborted';
            break;
          case 2:
            errorCode = 'MEDIA_ERR_NETWORK';
            errorMessage = 'Network error occurred while loading video';
            break;
          case 3:
            errorCode = 'MEDIA_ERR_DECODE';
            errorMessage = 'Video decoding failed';
            break;
          case 4:
            errorCode = 'MEDIA_ERR_SRC_NOT_SUPPORTED';
            errorMessage = 'Video format not supported';
            break;
          default:
            errorCode = `MEDIA_ERR_${video.error.code}`;
            errorMessage = `Video error code: ${video.error.code}`;
        }
      }
      
      trackVideoError(errorCode, errorMessage);
    }
  };

  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    // Проверяем, что клик не по элементам управления
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('.video-controls')) {
      return; // Игнорируем клики по кнопкам управления
    }

    // Отслеживаем двойной клик
    if (typePage === 'mainPage') {
      trackVideoCTA('Watch the Video');
    }

    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    if (!video.paused) {
      // Видео воспроизводится - ставим на паузу
      video.pause();
      setIsVideoPlaying(false);
      // НЕ показываем превью при паузе - видео остается видимым
    } else {
      // Видео на паузе или остановлено - запускаем
      setIsVideoPlaying(true);
      setHasVideoStarted(true);
      
      // Простая логика для Safari
      try {
        video.muted = false;
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Видео успешно запущено
            })
            .catch((error) => {
              setIsVideoPlaying(false);
            });
        }
      } catch (error) {
        setIsVideoPlaying(false);
      }
    }
  };

  // Отдельная функция для отслеживания клика по изображению
  const handleImageClick = () => {
    if (typePage === 'mainPage') {
      trackVideoCTA('Video Preview Image');
    }
    
    // При клике на изображение всегда запускаем видео
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Устанавливаем состояние воспроизведения с небольшой задержкой
      setTimeout(() => {
        setIsVideoPlaying(true);
        setHasVideoStarted(true);
      }, 100);
      
      // Запускаем видео
      try {
        video.muted = false;
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Видео успешно запущено
              setIsVideoPlaying(true);
            })
            .catch((error) => {
              setIsVideoPlaying(false);
            });
        }
      } catch (error) {
        setIsVideoPlaying(false);
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
        
        <div 
          ref={videoBlockRef}
          className={styles.videoContainer} 
          style={{ position: 'relative', width: 260, height: 146 }}
        >
          {/* Видео всегда рендерится, но может быть на паузе */}
                      <video
              ref={videoRef}
              className={styles.frameChild}
              width={260}
              height={146}
              controls
              preload="auto"
              style={{ cursor: 'pointer', position: 'relative', zIndex: 2 }}
              onDoubleClick={(event) => handleVideoClick(event)}
              onLoadedMetadata={() => setIsVideoLoaded(true)}
              onEnded={() => {
                setIsVideoPlaying(false);
                setIsVideoPaused(false);
              }}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeeked={handleSeeked}
              onVolumeChange={handleVolumeChange}
              onError={handleError}
            >
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Изображение поверх видео только когда видео не было запущено */}
          {!hasVideoStarted && (
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              zIndex: 10,
              width: '100%',
              height: '100%'
            }}>
              {useNextImage ? (
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
              )}
            </div>
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
          onClick={() => {
            // Для кнопки используем упрощенную логику
            if (videoRef.current) {
              const video = videoRef.current;
              if (!video.paused) {
                video.pause();
                setIsVideoPlaying(false);
              } else {
                video.play();
                setIsVideoPlaying(true);
                setHasVideoStarted(true);
              }
            }
          }}
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
