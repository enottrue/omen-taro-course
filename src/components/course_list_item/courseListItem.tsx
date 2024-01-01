import Link from 'next/link';
import React, { useState } from 'react';
import { Key } from 'react';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
 

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
    <div
      className={`cource-lessons__item ${isActive ? 'active' : ''}  ${
        isAllFinished ? 'cource-lessons__item_compleeted' : ''
      }`}
 
    >
      <div
        className="cource-lessons__item-header"
        role="button"
        onClick={toggleActive}
      >
        <div className="cource-lessons__item-header-counter">{counter}.</div>
        <div className="cource-lessons__item-header-title">{title}</div>
      </div>
      <div className="cource-lessons__item-content">
        <ol className="cource-lessons__item-content-list">
          {contentStages.map((item, i: Key) => {
            return (
              <Link
                href={`/lesson/${lessonNumber}/${item.stageNumber}`}
                key={i}
              >
                <li
                   className={`cource-lessons__item-content-list-item ${
                    item.stageStatuses[0]?.status === 'finished'
                      ? 'cource-lessons__item-content-list-item_compleeted'
                      : item.stageStatuses[0]?.status === 'paused'
                      ? 'cource-lessons__item-content-list-item_paused'
                      : ''
                  }`}
 
                  key={i}
                >
                  <span className="cource-lessons__item-content-list-item-title">
                    {lessonNumber + '.' + item.stageNumber} {item.stageName}
                  </span>
                </li>
              </Link>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default CourseListItem;
