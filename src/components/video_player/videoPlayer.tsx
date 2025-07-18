import React from 'react';
import dynamic from 'next/dynamic';
import { ReactEventHandler } from 'react';
import { useMutation } from '@apollo/client';
import { CHANGE_STAGE_STATUS } from '@/graphql/queries';
import { STAGE_STATUSES } from '@/utils/stageStatusUtils';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

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

  const handleVideoStart: ReactEventHandler<HTMLVideoElement> = (e) => {
    console.log('video started', e);
    
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
  return (
    <div className="cource-lesson-header__media">
      <video
        controls
        src={url ? url : ''}
        poster={preview ? preview : ''}
        onPlay={handleVideoStart}
        onEnded={handleVideoEnd}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          display: 'block',
          borderRadius: '10px'
        }}
      />
    </div>
    // <ReactPlayer url={[{ src: '/videos/1_2.mp4', type: 'video/mp4' }]} />
  );
}
