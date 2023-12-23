import Link from 'next/link';
import React, { useState } from 'react';
import { Key } from 'react';

interface CourseListItemProps {
  counter: number;
  title: string;
  lessonNumber: number;
  contentStages: {
    stageNumber: number;
    stageName: string;
  }[];
}

const CourseListItem: React.FC<CourseListItemProps> = ({
  counter,
  title,
  contentStages,
  lessonNumber,
}) => {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      className={`cource-lessons__item ${
        isActive ? 'active' : ''
      } cource-lessons__item_compleeted`}
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
                  className="cource-lessons__item-content-list-item cource-lessons__item-content-list-item_compleeted"
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
