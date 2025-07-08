import courseMedia from '@/images/cource-media.jpeg';
import Image from 'next/image';
import PlayButton from '@/images/svg/play-button.svg';
import Button from '../button/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VideoPlayer from '../video_player/videoPlayer';
import LessonTimeline from '../lesson_timeline/lessonTimeline';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import {
  ADD_STAGE_STATUS,
  CHANGE_STAGE_STATUS,
  GET_STAGE_STATUS,
} from '@/graphql/queries';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { stageData } from '@/lib/dump-data/lessonsData';
import styles from '@/components/component1/component1.module.css';
import './lessonHeader.scss';

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
          status: 'new',
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
      lesson.lessonStages[Number(currentStageId) - 1].id,
    );
    if (finishedStage) {
      const currentStage = lesson.lessonStages.find(
        (stage: any) => stage.stageNumber == currentStageId,
      );

      const a = changeStageStatus({
        variables: {
          stageId: Number(currentStage?.id),
          userId: Number(cc?.userId),
          status: 'finished',
        },
      }).then((res) => {
        console.log('res', res, lesson);
        setFinishedStage(false);
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
                href="mailto:support@astro-irena.com?subject=Вопрос по курсу Таро&body=Здравствуйте! У меня есть вопрос по курсу Таро:"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.div1}>Задать вопрос</div>
              </a>
              <div 
                className={styles.burgerMenu}
                style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', minWidth: 'fit-content' }}
              >
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
              </div>
            </div>
          </header>
          <div className="lesson-frame-div">
            <div className="lesson-frame-parent1">
              <div className="lesson-frame-parent2">
                <div className="lesson-parent">
                  <h1 className="lesson-title">
                    <span className="lesson-title-counter">
                      {lesson.lessonNumber + '.'}
                    </span>
                    <span className="lesson-title-text">
                      {lesson.lessonName}
                    </span>
                  </h1>
                  <span className="lesson-subtitle-divider"></span>
                  <div className="lesson-subtitle">
                    <span className="lesson-subtitle-counter">
                      {lesson.lessonNumber + '.' + currentStageId}
                    </span>
                    <span className="lesson-subtitle-text">
                      {currentStageId &&
                        lesson.lessonStages[Number(currentStageId) - 1] &&
                        lesson.lessonStages[Number(currentStageId) - 1].stageName}
                    </span>
                  </div>
                </div>
                
                
                <VideoPlayer
                  url={`https://storage.yandexcloud.net/omen-course/${currentLessonId}_${currentStageId}.mp4`}
                  preview={`/preview/${currentLessonId}_${currentStageId}.png`}
                  finished={finishedStage}
                  setFinished={setFinishedStage}
                  stageId={lesson.lessonStages[Number(currentStageId) - 1]}
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
                        <span className="lesson-navigation-item-text">Назад</span>
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
                        {nextStageExists ? 'Вперед' : 'К курсам'}
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
                      Вернуться к списку уроков
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="lesson-frame-div">
            <div className="lesson-frame-parent1">
              <div className="lesson-frame-parent2">
                <div className="lesson-div1">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        lesson.lessonStages[Number(currentStageId) - 1]
                          .stageDescription,
                    }}
                  />
                </div>


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
