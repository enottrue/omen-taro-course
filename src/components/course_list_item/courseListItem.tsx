import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Key } from 'react';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import Image from 'next/image';
import { isStageFinished, getStageStatusClass } from '@/utils/stageStatusUtils';
import { useMetrica } from 'next-yandex-metrica';

interface CourseListItemProps {
  counter: number;
  title: string;
  lessonNumber: number | string;
  contentStages: {
    stageNumber: number;
    stageName: string;
     stageStatuses: any[];
  }[];
  isAccessible?: boolean;
}

const CourseListItem: React.FC<CourseListItemProps> = ({
  counter,
  title,
  contentStages,
  lessonNumber,
  isAccessible = true,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [syncedStages, setSyncedStages] = useState(contentStages);
  const cc = useContext(MainContext);
  const { reachGoal } = useMetrica();
   
  //  console.log('CourseListItem rendered:', {
  //    counter,
  //    title,
  //    lessonNumber,
  //    contentStagesCount: contentStages?.length || 0
  //  });

  // Синхронизируем данные этапов с актуальными статусами из контекста
  useEffect(() => {
    if (cc?.stageData && contentStages) {
      console.log('CourseListItem: Syncing stages with stageData', {
        lessonNumber,
        contentStages: contentStages.map(s => ({ 
          stageNumber: s.stageNumber, 
          status: s.stageStatuses?.[0]?.status 
        })),
        stageData: cc.stageData.map((s: any) => ({ 
          stageId: s.stageId, 
          status: s.status 
        }))
      });
      
      const updatedStages = contentStages.map(stage => {
        // Ищем актуальный статус этапа в stageData
        const currentStageStatus = cc.stageData.find((statusItem: any) => 
          statusItem.stageId === stage.stageNumber
        );
        
        if (currentStageStatus) {
          console.log(`CourseListItem: Found status for stage ${stage.stageNumber}:`, currentStageStatus);
          return {
            ...stage,
            stageStatuses: [currentStageStatus]
          };
        }
        
        console.log(`CourseListItem: No status found for stage ${stage.stageNumber}`);
        return stage;
      });
      
      setSyncedStages(updatedStages);
    }
  }, [cc?.stageData, contentStages, lessonNumber]);

  // Логируем изменения в syncedStages
  useEffect(() => {
    console.log('CourseListItem: syncedStages updated', {
      lessonNumber,
      syncedStages: syncedStages.map(s => ({ 
        stageNumber: s.stageNumber, 
        status: s.stageStatuses?.[0]?.status 
      }))
    });
  }, [syncedStages, lessonNumber]);

  const toggleActive = () => {
    if (!isAccessible) return; // Не позволяем открывать недоступные уроки
    setIsActive(!isActive);
    // Send Yandex Metrica event for course view
    reachGoal('course_viewed', { lessonId: lessonNumber, lessonTitle: title });
  };
  
  // Check if all stages in this lesson are finished
  const isAllFinished = syncedStages.every((stage) => {
    return isStageFinished(stage.stageStatuses);
  });


  return (
    <>
      <div
        className={`frame-parent6 accordion ${isActive ? 'active' : ''} ${
          isAllFinished ? 'cource-lessons__item_compleeted' : ''
        } ${!isAccessible ? 'cource-lessons__item_disabled' : ''}`}
        style={!isAccessible ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        <div
          className="accordion-header"
          role="button"
          onClick={toggleActive}
        >
          <div className="empty-elements-parent">
            {/* <b className="empty-elements">{counter}.</b> */}
            <div className="container">
              <b className="b">
                {title}
              </b>
            </div>
          </div>
          <div className="group">
            <Image 
              src={isAccessible ? "/svg/lock-dollar.svg" : "/svg/lock.svg"} 
              alt={isAccessible ? "Доступно" : "Недоступно"} 
              width={26}
              height={26}
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
          {syncedStages.map((item, i: Key) => {
            return (
              <React.Fragment key={i}>
                <div className="content-wrapper-inner">
                  <div className="content-wrapper">
                    {isAccessible ? (
                      <Link
                        href={`/lesson/${lessonNumber}/${item.stageNumber}`}
                        className={`${getStageStatusClass(item.stageStatuses)}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <p style={{ margin: 0 }}>
                           {item.stageName}
                        </p>
                      </Link>
                    ) : (
                      <div
                        className={`${getStageStatusClass(item.stageStatuses)}`}
                        style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          opacity: 0.5,
                          cursor: 'not-allowed'
                        }}
                      >
                        <p style={{ margin: 0 }}>
                           {item.stageName}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="btn-wrapper">
                    <Image 
                      src={isAccessible ? "/svg/lock-dollar.svg" : "/svg/lock.svg"} 
                      alt={isAccessible ? "Доступно" : "Недоступно"} 
                      width={26}
                      height={26}
                    />
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
