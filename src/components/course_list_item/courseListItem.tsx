import React, { useState } from 'react';

interface CourseListItemProps {
  counter: number;
  title: string;
  contentTitle: {
    number: number;
    content: string;
  }[];
}

const CourseListItem: React.FC<CourseListItemProps> = ({
  counter,
  title,
  contentTitle,
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
      onClick={toggleActive}
    >
      <div className="cource-lessons__item-header" role="button">
        <div className="cource-lessons__item-header-counter">{counter}.</div>
        <div className="cource-lessons__item-header-title">{title}</div>
      </div>
      <div className="cource-lessons__item-content">
        <ol className="cource-lessons__item-content-list">
          {contentTitle.map((item, i) => {
            return (
              <li
                className="cource-lessons__item-content-list-item cource-lessons__item-content-list-item_compleeted"
                key={i}
              >
                <span className="cource-lessons__item-content-list-item-title">
                  {item.content}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default CourseListItem;
