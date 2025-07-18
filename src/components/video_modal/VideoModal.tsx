import React, { useRef, useEffect, useState } from 'react';
import styles from './VideoModal.module.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  // Optionally, add subtitleSrc?: string in the future
}

const VIDEO_POSTER = '/images/video-poster.jpg'; // Placeholder poster image

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCanPlay = () => {
    setLoading(false);
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      ref={modalRef}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close video modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* Skeleton loader while video is loading */}
        {loading && (
          <div className={styles.skeletonLoader}>
            <div className={styles.spinner} />
          </div>
        )}
        {/* Video player with preload auto and poster */}
        <video 
          className={styles.video}
          controls
          autoPlay
          preload="auto"
          poster={VIDEO_POSTER}
          aria-label="Video player"
          ref={videoRef}
          controlsList="nodownload"
          onContextMenu={e => e.preventDefault()}
          onCanPlay={handleCanPlay}
          style={loading ? { visibility: 'hidden' } : {}}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Placeholder for subtitles: */}
          {/* <track src="/videos/subs-en.vtt" kind="subtitles" srcLang="en" label="English" /> */}
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoModal; 