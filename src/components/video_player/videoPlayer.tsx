import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ReactEventHandler } from 'react';
import { useMutation } from '@apollo/client';
import { CHANGE_STAGE_STATUS } from '@/graphql/queries';
import { STAGE_STATUSES } from '@/utils/stageStatusUtils';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoStart: ReactEventHandler<HTMLVideoElement> = (e) => {
    console.log('video started', e);
    setHasVideoStarted(true);
    
    // Check if we have valid stage data
    if (!stageId?.id || !cc?.userId) {
      console.log('Missing stageId or userId, skipping status change');
      return;
    }
    
    // Check if stage is not already finished
    const currentStatus = stageId?.stageStatuses?.[0]?.status;
    if (currentStatus !== STAGE_STATUSES.FINISHED) {
      console.log('Setting stage status to in_progress');
      
      changeStageStatus({
        variables: {
          stageId: Number(stageId.id),
          userId: Number(cc.userId),
          status: STAGE_STATUSES.IN_PROGRESS,
        },
      }).then((res) => {
        console.log('Stage status changed to in_progress:', res);
        
        // Update stage data in context to reflect the change
        if (cc?.stageData) {
          const updatedStageData = cc.stageData.map((stageStatus: any) => {
            if (stageStatus.stageId === Number(stageId.id)) {
              return { ...stageStatus, status: STAGE_STATUSES.IN_PROGRESS };
            }
            return stageStatus;
          });
          cc.setStageData(updatedStageData);
        }
      }).catch((error) => {
        console.error('Error changing stage status to in_progress:', error);
      });
    } else {
      console.log('Stage is already finished, skipping status change');
    }
  };

  const handleVideoEnd: ReactEventHandler<HTMLVideoElement> = (e) => {
    console.log('video ended', e);
    console.log('before finished status', finished);
    setFinished && setFinished(true);
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
        }).catch(error => {
          console.log('Auto-play was prevented:', error);
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
          <img
            src={preview}
            alt="Video preview"
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
          muted
          src={url ? url : ''}
          poster={preview ? preview : ''}
          onPlay={handleVideoStart}
          onEnded={handleVideoEnd}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            display: 'block',
            borderRadius: '10px',
            pointerEvents: 'auto'
          }}
        />
      )}
    </div>
    // <ReactPlayer url={[{ src: '/videos/1_2.mp4', type: 'video/mp4' }]} />
  );
}
