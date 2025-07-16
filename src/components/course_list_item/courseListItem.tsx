import Link from 'next/link';
import React, { useState } from 'react';
import { Key } from 'react';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import Image from 'next/image';

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

 

  const toggleActive = () => {
    setIsActive(!isActive);
  };
   const isAllFinished = contentStages.every((stage) => {
    if (!stage.stageStatuses[0]) {
    }
    return stage.stageStatuses[0]?.status === 'finished';
  });

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
            <b className="empty-elements">{counter}.</b>
            <div className="container">
              <b className="b">{title}</b>
            </div>
          </div>
          <div className="group">
            <Image
              className="icon"
              loading="lazy"
              alt=""
              src="/svg/pause.svg"
              width={26}
              height={26}
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
            const isFinished = item.stageStatuses[0]?.status === 'finished';
            const isPaused = item.stageStatuses[0]?.status === 'paused';
            
            return (
              <React.Fragment key={i}>
                <div className="content-wrapper-inner">
                  <div className="content-wrapper">
                    <Link
                      href={`/lesson/${lessonNumber}/${item.stageNumber}`}
                      className={`  ${
                        isFinished
                          ? 'cource-lessons__item-content-list-item_compleeted'
                          : isPaused
                          ? 'cource-lessons__item-content-list-item_paused'
                          : ''
                      }`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <p style={{ margin: 0 }}>
                        {lessonNumber + '.' + item.stageNumber} {item.stageName}
                      </p>
                    </Link>
                  </div>
                  <div className="btn-wrapper">
                    <Image src="/svg/pause.svg" alt="arrow-down" width={26} height={26} />
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
