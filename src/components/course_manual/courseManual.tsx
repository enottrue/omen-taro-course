import React from 'react';
import Button from '@/components/button/Button';
import { useState } from 'react';
import Image from 'next/image';
import CourseListItem from '@/components/course_list_item/courseListItem';
import { Key } from 'react';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

interface CoursePdfItemProps {
  lessons?: any[];
}

export const CoursePdfItem = ({ lessons }: CoursePdfItemProps) => {
  const cc = useContext(MainContext);
  // Если lessons не передан, берем из MainContext, если пользователь авторизован
  const userId = cc?.userId;
  const contextLessons = userId ? cc?.lessons : null;
  const displayLessons = lessons || contextLessons;

  return (
    <>
      <div className="about-the-parent">
        <h1 className="cosmo">About the</h1>
        <h2 className="instructor">Instructor:</h2>
      </div>
      <div className="frame-parent5">
        {/* Убираем аккордеон "Электронная методичка" и оставляем только уроки */}
        {displayLessons?.map((lesson: any, i: Key) => {
          return (
            <CourseListItem
              contentStages={lesson.lessonStages}
              counter={lesson.lessonNumber}
              title={lesson.lessonName}
              lessonNumber={lesson.lessonNumber}
              key={i}
            />
          );
        })}
      </div>
    </>
  );
};

export default CoursePdfItem;
