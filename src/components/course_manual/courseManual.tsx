import React from 'react';
import Button from '@/components/button/Button';
import { useState } from 'react';

export const CoursePdfItem = () => {
  const [state, setState] = useState(true);

  return (
    <div
      className={'cource-lessons__item' + ' ' + (state ? 'active' : '')}
      onClick={() => setState(!state)}
    >
      <div className="cource-lessons__item-header" role="button">
        <div className="cource-lessons__item-header-counter"> </div>
        <div className="cource-lessons__item-header-title">
          Электронная методичка.
        </div>
      </div>
      <div className="cource-lessons__item-content">
        <ol className="cource-lessons__item-content-list">
          <li className="cource-lessons__item-content-list-item">
            <span className="cource-lessons__item-content-list-item-title">
              Электронная методичка
            </span>
            <span className="cource-lessons__item-content-list-item-button">
              <Button
                title="Скачать в PDF"
                href="/course_book"
                isLink={true}
                className="button_secondary button_secondary_smaller"
              />
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default CoursePdfItem;
