import courseMedia from '@/images/cource-media.jpeg';
import Image from 'next/image';
import PlayButton from '@/images/svg/play-button.svg';
import Button from '../button/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VideoPlayer from '../video_player/videoPlayer';
import LessonTimeline from '../lesson_timeline/lessonTimeline';
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import {
  ADD_STAGE_STATUS,
  CHANGE_STAGE_STATUS,
  GET_STAGE_STATUS,
} from '@/graphql/queries';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { stageData } from '@/lib/dump-data/lessonsData';
import styles from '@/components/component1/component1.module.scss';
import './lessonHeader.scss';
import BurgerMenu from '../component1/BurgerMenu';
import { STAGE_STATUSES } from '@/utils/stageStatusUtils';

export default function CourseLessonHeader({
  lesson,
  currentLessonId,
  currentStageId,
}: {
  lesson: any;
  currentLessonId: string | undefined;
  currentStageId: string | undefined;
}) {
  const cc = useContext(MainContext);
  


  const [finishedStage, setFinishedStage] = useState(false);
  const [createStageStatus] = useMutation(ADD_STAGE_STATUS);
  const [changeStageStatus] = useMutation(CHANGE_STAGE_STATUS);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);

  const handleBurgerClick = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  // Close burger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (burgerRef.current && !burgerRef.current.contains(event.target as Node)) {
        setIsBurgerOpen(false);
      }
    };

    if (isBurgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBurgerOpen]);

  const {
    loading: stageStatusLoading,
    error: stageStatusError,
    data: stageStatusData,
  } = useQuery(GET_STAGE_STATUS, {
    variables: {
      stageId: Number(currentStageId),
      userId: Number(cc?.userId),
    },
  });

  useEffect(() => {
    if (
      stageStatusError &&
      stageStatusError.message === 'ApolloError: StageStatus not found'
    ) {
      // If the StageStatus doesn't exist, create it
      createStageStatus({
        variables: {
          stageId: Number(currentStageId),
          userId: Number(cc?.userId),
          status: STAGE_STATUSES.NEW,
        },
      });
    }
  }, [stageStatusError, stageStatusLoading, stageStatusData]);

  // addStageStatus({ variables: { stageId: 1, userId: 1, status: 'new' } });
  useEffect(() => {
    console.log(
      'currentStageId',
      currentStageId,
      'lessons',
      lesson,
      'currentStage:',
      lesson?.lessonStages?.find((s: any) => s.stageNumber === Number(currentStageId)),
    );
    if (finishedStage && lesson?.lessonStages) {
      const currentStage = lesson.lessonStages.find(
        (stage: any) => stage.stageNumber == currentStageId,
      );

      if (!currentStage?.id) {
        console.error('Current stage not found');
        setFinishedStage(false);
        return;
      }

      const a = changeStageStatus({
        variables: {
          stageId: Number(currentStage.id),
          userId: Number(cc?.userId),
          status: STAGE_STATUSES.FINISHED,
        },
      }).then((res) => {
        console.log('res', res, lesson);
        setFinishedStage(false);
        
        // Update stage data in context to reflect the change
        if (cc?.stageData) {
          const updatedStageData = cc.stageData.map((stageStatus: any) => {
            if (stageStatus.stageId === Number(currentStage.id)) {
              return { ...stageStatus, status: STAGE_STATUSES.FINISHED };
            }
            return stageStatus;
          });
          cc.setStageData(updatedStageData);
        }
      });
    }
  }, [finishedStage]);

  const nextStageExists = lesson?.lessonStages?.some((stage: any) => {
    return Number(stage.stageNumber) === Number(currentStageId) + 1;
  });
  const router = useRouter();
  const nextButtonClickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStageId) {
      if (nextStageExists) {
        router.push(`/lesson/${currentLessonId}/${Number(currentStageId) + 1}`);
      } else {
        router.push(`/courses`);
      }
    }
  };

  const previousButtonClickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStageId && currentStageId !== '1') {
      if (currentStageId !== '1') {
        router.push(`/lesson/${currentLessonId}/${Number(currentStageId) - 1}`);
      } else {
        router.push(`/courses`);
      }
    }
  };

  return (
    <div className="lesson-root">
      <section className="lesson-root-inner">
        <div className="lesson-frame-parent">
          {/* Header внутри root с правильными отступами */}
          <header className={styles.frameGroup}>
            <div className={styles.frameWrapper}>
              <div className={styles.cosmoParent}>
                <h3 className={styles.cosmo}>Cosmo.</h3>
                <b className={styles.irena}>Irena</b>
              </div>
            </div>
            <div className={styles.frameContainer}>
              <a 
                className={styles.container}
                href="mailto:support@astro-irena.com?subject=Question Astro-Irena&body=Hello, I have a question about the Astro-Irena course."
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.div1}>Ask a Question</div>
              </a>
              <div 
                ref={burgerRef}
                className={styles.burgerMenu}
                onClick={handleBurgerClick}
                style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', minWidth: 'fit-content' }}
              >
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <BurgerMenu isOpen={isBurgerOpen} onClose={handleBurgerClick} />
              </div>
            </div>
          </header>
          <div className="lesson-frame-div">
            <div className="lesson-frame-parent1">
              <div className="lesson-frame-parent2">
                <div className="lesson-div1">

                  
                  {/* Stage Description */}
                  {(() => {
                    const currentStage = lesson?.lessonStages?.find((s: any) => s.stageNumber === Number(currentStageId));
                    return currentStage?.stageDescription ? (
                      <div
                        className="lesson-div1"
                        dangerouslySetInnerHTML={{
                          __html: currentStage.stageDescription,
                        }}
                      />
                    ) : (
                      <div className="lesson-div1">
                        <p><strong>Lesson Description:</strong> Description for this lesson has not been added yet.</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lesson-frame-div">
            <div className="lesson-frame-parent1">
              <div className="lesson-frame-parent2">
                <div className="lesson-parent">
                  <h1 className="lesson-title">
                    <span className="lesson-title-counter">
                      {lesson?.lessonNumber + '.'}
                    </span>
                    <span className="lesson-title-text">
                      {lesson?.lessonName}
                    </span>
                  </h1>
                  <span className="lesson-subtitle-divider"></span>
                  <div className="lesson-subtitle">
                    <span className="lesson-subtitle-counter">
                      {lesson?.lessonNumber + '.' + currentStageId}
                    </span>
                    <span className="lesson-subtitle-text">
                      {currentStageId &&
                        lesson?.lessonStages?.find((s: any) => s.stageNumber === Number(currentStageId))?.stageName}
                    </span>
                  </div>
                </div>
                
                
                <VideoPlayer
                  url={`${process.env.NEXT_PUBLIC_VIDEO_URL + `/videos/` || 'https://storage.yandexcloud.net/omen-course/'}/${currentLessonId}_${currentStageId}.mp4`}
                  preview={`/preview/${currentLessonId}_${currentStageId}.png`}
                  finished={finishedStage}
                  setFinished={setFinishedStage}
                  stageId={lesson?.lessonStages?.find((s: any) => s.stageNumber === Number(currentStageId))}
                />
                
                <div className="lesson-navigation">
                  <div className="lesson-navigation-buttons">
                    {currentStageId !== '1' && (
                      <Button
                        className={
                          'lesson-navigation-item lesson-navigation-item_back button_ternary '
                        }
                        isLink
                        isLesson
                        onClick={previousButtonClickHandler}
                      >
                        <span className="lesson-navigation-item-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 18 16"
                            fill="none"
                          >
                            <path
                              d="M17 8H1M1 8L8 15M1 8L8 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="lesson-navigation-item-text">Back</span>
                      </Button>
                    )}
                    
                    <Button
                      className={
                        'lesson-navigation-item lesson-navigation-item_next button_primary '
                      }
                      isLink
                      isLesson
                      onClick={nextButtonClickHandler}
                    >
                      <span className="lesson-navigation-item-text">
                        {nextStageExists ? 'Next' : 'To Courses'}
                      </span>
                      <span className="lesson-navigation-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 18 16"
                          fill="none"
                        >
                          <path
                            d="M1 8H17M17 8L10 1M17 8L10 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Button>
                  </div>
                  
                  <Button
                    className={
                      'lesson-navigation-item lesson-navigation-item_to-list button_primary '
                    }
                    isLink
                    isLesson
                    onClick={() => router.push('/courses')}
                  >
                    <span className="lesson-navigation-item-text">
                      Return to Lesson List
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Homework Section */}
          {(() => {
            const currentStage = lesson?.lessonStages?.find((s: any) => s.stageNumber === Number(currentStageId));
            return currentStage?.homework ? (
              <div className="lesson-frame-div">
                <div className="lesson-frame-parent1">
                  <div className="lesson-frame-parent2">
                    <div className="lesson-homework">
                      <h3 className="lesson-homework-title">Homework</h3>
                      <div
                        className="lesson-homework-content"
                        dangerouslySetInnerHTML={{
                          __html: currentStage.homework,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {/* Timeline Section */}
          <div className="lesson-frame-div">
            <div className="lesson-frame-parent1">
              <div className="lesson-frame-parent2">
                {(() => {
                  const currentStage = lesson?.lessonStages?.find((s: any) => s.stageNumber === Number(currentStageId));
                  return currentStage ? (
                    <LessonTimeline stage={currentStage} />
                  ) : null;
                })()}
              </div>
            </div>
          </div>

        </div>
      </section>
      <div className="frame-wrapper2">
          <div className="frame-wrapper3">
            <div className="cosmo-group">
              <h3 className="cosmo">Cosmo.</h3>
              <b className="irena1">Irena</b>
            </div>
          </div>
        </div>
    </div>
  );
}
