import Link from 'next/link';
import React, { useState } from 'react';
import { Key } from 'react';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import Image from 'next/image';
import { isStageFinished, getStageStatusClass } from '@/utils/stageStatusUtils';
import { StatusIcon } from '@/components/ui';

interface CourseListItemProps {
  counter: number;
  title: string;
  lessonNumber: number;
  contentStages: {
    stageNumber: number;
    stageName: string;
     stageStatuses: any[];
  }[];
}

const CourseListItem: React.FC<CourseListItemProps> = ({
  counter,
  title,
  contentStages,
  lessonNumber,
}) => {
  const [isActive, setIsActive] = useState(false);
   const cc = useContext(MainContext);
   
  //  console.log('CourseListItem rendered:', {
  //    counter,
  //    title,
  //    lessonNumber,
  //    contentStagesCount: contentStages?.length || 0
  //  });

 

  const toggleActive = () => {
    setIsActive(!isActive);
  };
  // Check if all stages in this lesson are finished
  const isAllFinished = contentStages.every((stage) => {
    return isStageFinished(stage.stageStatuses);
  });

  // Get overall lesson status based on stages
  const getLessonStatus = () => {
    if (contentStages.length === 0) return [];
    
    const allStageStatuses = contentStages.map(stage => stage.stageStatuses).flat();
    if (allStageStatuses.length === 0) return [];
    
    // If all stages are finished, return finished status
    if (isAllFinished) {
      return [{ status: 'finished' }];
    }
    
    // If any stage is in progress, return in_progress status
    const hasInProgress = contentStages.some(stage => 
      stage.stageStatuses && stage.stageStatuses.length > 0 && 
      stage.stageStatuses[0]?.status === 'in_progress'
    );
    
    if (hasInProgress) {
      return [{ status: 'in_progress' }];
    }
    
    // Default to new status
    return [{ status: 'new' }];
  };

  return (
    <>
      <div
        className={`frame-parent6 accordion ${isActive ? 'active' : ''} ${
          isAllFinished ? 'cource-lessons__item_compleeted' : ''
        }`}
      >
        <div
          className="accordion-header"
          role="button"
          onClick={toggleActive}
        >
          <div className="empty-elements-parent">
            {/* <b className="empty-elements">{counter}.</b> */}
            <div className="container">
              <b className="b">{title}</b>
            </div>
          </div>
          <div className="group">
            <StatusIcon 
              stageStatuses={getLessonStatus()} 
              size={26} 
              className="icon"
            />
            <Image
              className={`frame-icon ${isActive ? 'rotated' : ''}`}
              loading="lazy"
              alt=""
              src="/svg/arrow-down.svg"
              width={23}
              height={23}
            />
          </div>
        </div>
        <div className="accordion-content">
          {contentStages.map((item, i: Key) => {
            return (
              <React.Fragment key={i}>
                <div className="content-wrapper-inner">
                  <div className="content-wrapper">
                    <Link
                      href={`/lesson/${lessonNumber}/${item.stageNumber}`}
                      className={`${getStageStatusClass(item.stageStatuses)}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <p style={{ margin: 0 }}>
                         {item.stageName}
                      </p>
                    </Link>
                  </div>
                  <div className="btn-wrapper">
                    <StatusIcon stageStatuses={item.stageStatuses} size={26} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CourseListItem;
