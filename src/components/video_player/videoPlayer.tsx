import React from 'react';

import dynamic from 'next/dynamic';
import { ReactEventHandler } from 'react';

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
  stageId?: string;
  setFinished?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleVideoEnd: ReactEventHandler<HTMLVideoElement> = (e) => {
    console.log('video ended', e);
    console.log('before finished status', finished);
    setFinished && setFinished(true);
  };
  return (
    <div className="cource-lesson-header__media">
      <video
        controls
        src={url ? url : ''}
        poster={preview ? preview : ''}
        onEnded={handleVideoEnd}
        // type="video/mp4"
      />
    </div>
    // <ReactPlayer url={[{ src: '/videos/1_2.mp4', type: 'video/mp4' }]} />
  );
}
