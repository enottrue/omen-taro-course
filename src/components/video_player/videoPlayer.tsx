import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ReactEventHandler } from 'react';
import { useMutation } from '@apollo/client';
import { CHANGE_STAGE_STATUS } from '@/graphql/queries';
import { STAGE_STATUSES } from '@/utils/stageStatusUtils';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { useMetrica } from 'next-yandex-metrica';
import './videoPlayer.css';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function VideoPlayer({
  url,
  preview,
  finished,
  setFinished,
  stageId,
}: {
  url?: string;
  preview?: string;
  finished?: boolean;
  stageId?: any;
  setFinished?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const cc = useContext(MainContext);
  const [changeStageStatus] = useMutation(CHANGE_STAGE_STATUS);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { reachGoal } = useMetrica();

  const handleVideoStart: ReactEventHandler<HTMLVideoElement> = (e) => {
    setHasVideoStarted(true);
    setIsPlaying(true);
    
    // Send Yandex Metrica event for video start
    reachGoal('video_started', { 
      stageId: stageId?.id, 
      stageName: stageId?.stageName 
    });
    
    console.log('VideoPlayer: Video started', { 
      stageId: stageId?.id, 
      stageName: stageId?.stageName,
      currentStatus: stageId?.stageStatuses?.[0]?.status 
    });
    
    // Check if we have valid stage data
    if (!stageId?.id || !cc?.userId) {
      console.log('VideoPlayer: Missing stageId or userId', { stageId: stageId?.id, userId: cc?.userId });
      return;
    }
    
    // Check if stage is not already finished
    const currentStatus = stageId?.stageStatuses?.[0]?.status;
    if (currentStatus !== STAGE_STATUSES.FINISHED) {
      console.log('VideoPlayer: Updating stage status to IN_PROGRESS', { 
        stageId: stageId.id, 
        currentStatus 
      });
      
      changeStageStatus({
        variables: {
          stageId: Number(stageId.id),
          userId: Number(cc.userId),
          status: STAGE_STATUSES.IN_PROGRESS,
        },
      }).then(() => {
        console.log('VideoPlayer: Successfully updated stage status to IN_PROGRESS');
        // Update stage data in context to reflect the change
        if (cc?.stageData) {
          const updatedStageData = cc.stageData.map((stageStatus: any) => {
            if (stageStatus.stageId === Number(stageId.id)) {
              return { ...stageStatus, status: STAGE_STATUSES.IN_PROGRESS };
            }
            return stageStatus;
          });
          cc.setStageData(updatedStageData);
          console.log('VideoPlayer: Updated stageData in context', updatedStageData);
        }
      }).catch((error) => {
        // Silent error handling for production
        console.error('VideoPlayer: Error updating stage status to IN_PROGRESS:', error);
      });
    } else {
      console.log('VideoPlayer: Stage already finished, skipping status update');
    }
  };

  const handleVideoEnd: ReactEventHandler<HTMLVideoElement> = (e) => {
    setIsPlaying(false);
    
    // Send Yandex Metrica event for video completion
    reachGoal('video_completed', { 
      stageId: stageId?.id, 
      stageName: stageId?.stageName 
    });
    
    console.log('VideoPlayer: Video ended', { 
      stageId: stageId?.id, 
      stageName: stageId?.stageName 
    });
    
    // Update stage status to finished when video completes
    if (stageId?.id && cc?.userId) {
      console.log('VideoPlayer: Updating stage status to FINISHED', { 
        stageId: stageId.id 
      });
      
      changeStageStatus({
        variables: {
          stageId: Number(stageId.id),
          userId: Number(cc.userId),
          status: STAGE_STATUSES.FINISHED,
        },
      }).then(() => {
        console.log('VideoPlayer: Successfully updated stage status to FINISHED');
        // Update stage data in context to reflect the change
        if (cc?.stageData) {
          const updatedStageData = cc.stageData.map((stageStatus: any) => {
            if (stageStatus.stageId === Number(stageId.id)) {
              return { ...stageStatus, status: STAGE_STATUSES.FINISHED };
            }
            return stageStatus;
          });
          cc.setStageData(updatedStageData);
          console.log('VideoPlayer: Updated stageData in context to FINISHED', updatedStageData);
        }
      }).catch((error) => {
        // Silent error handling for production
        console.error('VideoPlayer: Error updating stage status to FINISHED:', error);
      });
    } else {
      console.log('VideoPlayer: Missing stageId or userId for FINISHED update', { 
        stageId: stageId?.id, 
        userId: cc?.userId 
      });
    }
    
    setFinished && setFinished(true);
  };

  // Обработчик паузы видео - не показываем превью при паузе
  const handleVideoPause: ReactEventHandler<HTMLVideoElement> = (e) => {
    console.log('VideoPlayer: Video paused');
    setIsPlaying(false);
    // Не изменяем hasVideoStarted, чтобы превью не показывалось
    // Видео просто остается на паузе
  };

  // Обработка прогресса видео
  const handleTimeUpdate: ReactEventHandler<HTMLVideoElement> = (e) => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const currentTime = video.currentTime;
    const duration = video.duration;
    
    if (duration > 0) {
      const percent = (currentTime / duration) * 100;
      
      // Контрольные точки: 25%, 50%, 75%, 100%
      const checkpoints = [25, 50, 75, 100];
      
      checkpoints.forEach(checkpoint => {
        if (percent >= checkpoint && percent < checkpoint + 1) {
          // Отправляем событие только один раз для каждой контрольной точки
          const key = `lesson_checkpoint_${checkpoint}`;
          if (!video.dataset[key]) {
            video.dataset[key] = 'true';
            
            // Send Yandex Metrica event for lesson video progress
            reachGoal('lesson_video_progress', { 
              progress: checkpoint,
              currentTime: currentTime,
              stageId: stageId?.id,
              stageName: stageId?.stageName
            });
          }
        }
      });
    }
  };

  // Обработчик двойного клика по видео для паузы/воспроизведения
  const handleVideoClick = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.paused) {
        // Если видео на паузе - запускаем
        setIsPlaying(true);
        video.play().catch((error) => {
          console.log('VideoPlayer: Error playing video on double click:', error);
          setIsPlaying(false);
        });
      } else {
        // Если видео воспроизводится - ставим на паузу
        setIsPlaying(false);
        video.pause();
      }
    }
  };

  // Protection against video downloading
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent common keyboard shortcuts for saving/downloading
    if (
      (e.ctrlKey || e.metaKey) && 
      (e.key === 's' || e.key === 'S' || e.key === 'c' || e.key === 'C')
    ) {
      e.preventDefault();
      return false;
    }
    
    // Prevent F12, Ctrl+Shift+I, Ctrl+U (developer tools)
    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') ||
      ((e.ctrlKey || e.metaKey) && e.key === 'u')
    ) {
      e.preventDefault();
      return false;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  const handlePreviewClick = () => {
    setHasVideoStarted(true);
    // Автоматически запускаем видео после небольшой задержки
    setTimeout(() => {
      if (videoRef.current) {
        // Сначала запускаем с muted для обхода ограничений браузера
        videoRef.current.muted = true;
        videoRef.current.play().then(() => {
          // После успешного запуска включаем звук
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
            }
          }, 200);
        }).catch(() => {
          // Если автозапуск не удался, просто включаем звук
          if (videoRef.current) {
            videoRef.current.muted = false;
          }
        });
      }
    }, 100);
  };

  return (
    <div 
      className="cource-lesson-header__media"
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onDragStart={handleDragStart}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        position: 'relative'
      }}
    >
      {!hasVideoStarted && preview ? (
        <div 
          className="video-preview-container"
          onClick={handlePreviewClick}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            display: 'block',
            borderRadius: '10px',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Image
            src={preview}
            alt="Video preview"
            width={800}
            height={450}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              display: 'block'
            }}
          />
          <div 
            className="play-button-overlay"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      ) : (
      <video
          ref={videoRef}
        controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          playsInline
          x-webkit-airplay="allow"
          muted
        src={url ? url : ''}
        poster={preview ? preview : ''}
        onPlay={handleVideoStart}
        onEnded={handleVideoEnd}
        onPause={handleVideoPause}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleVideoClick}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          display: 'block',
            borderRadius: '10px',
            pointerEvents: 'auto',
            cursor: 'pointer',
            objectFit: 'contain'
        }}
        {...({'webkit-playsinline': 'true'} as any)}
      />
      )}
    </div>
    // <ReactPlayer url={[{ src: '/videos/1_2.mp4', type: 'video/mp4' }]} />
  );
}
