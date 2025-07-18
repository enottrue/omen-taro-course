import React from 'react';
import Button from '@/components/button/Button';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CourseListItem from '@/components/course_list_item/courseListItem';
import { Key } from 'react';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

interface CoursePdfItemProps {
  lessons?: any[];
}

// Pause icon SVG (inline)
const PauseIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="13" r="13" fill="#FF7635" />
    <rect x="9" y="8" width="3" height="10" rx="1.5" fill="white" />
    <rect x="14" y="8" width="3" height="10" rx="1.5" fill="white" />
  </svg>
);

// Download icon SVG (inline)
const DownloadIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2V11M7 11L3 7M7 11L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="12" width="10" height="1.5" rx="0.75" fill="white" />
  </svg>
);

// PdfItem component as accordion item with card design inside
const PdfItem = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`frame-parent6 accordion ${isOpen ? 'active' : ''}`}>
      <div className="accordion-header" role="button" onClick={() => setIsOpen(!isOpen)}>
        <div className="empty-elements-parent">
          <div className="container">
            <b className="b">Workbook</b>
          </div>
        </div>
        <div className="group">
          <img 
            alt="arrow-down" 
            loading="lazy" 
            width="23" 
            height="23" 
            decoding="async" 
            className={`frame-icon ${isOpen ? 'rotated' : ''}`}
            style={{color: 'transparent'}} 
            src="/svg/arrow-down.svg"
          />
        </div>
      </div>
      <div className="accordion-content">       
        <div className="pdf-download-section">
          <Link 
            href="/videos/Money_compass.pdf" 
            className="pdf-download-btn" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Open PDF Guide</span>
            <DownloadIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const CoursePdfItem = ({ lessons }: CoursePdfItemProps) => {
  const cc = useContext(MainContext);
  // Проверяем авторизацию пользователя
  const userId = cc?.userId;
  const user = cc?.user;
  const isUserAuthorized = userId && user && user.id;
  
  // Если lessons не передан, берем из MainContext, если пользователь авторизован
  const contextLessons = isUserAuthorized ? cc?.lessons : null;
  const displayLessons = lessons || contextLessons;

  return (
    <>
      <div className="about-the-parent">
        <h1 className="cosmo">About the</h1>
        <h2 className="instructor">Instructor:</h2>
      </div>
      <div className="frame-parent5">
        {/* PDF Item as accordion with card design inside */}
        <PdfItem />
        {/* Render lessons only for authorized users */}
        {isUserAuthorized && displayLessons?.map((lesson: any, i: Key) => {
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
        {/* Show message for unauthorized users */}
        {!isUserAuthorized && (
          <div className="unauthorized-message" style={{
            padding: '20px',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Please sign in to access the course lessons
          </div>
        )}
      </div>
    </>
  );
};

export default CoursePdfItem;
