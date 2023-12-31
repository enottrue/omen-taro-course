import courseMedia from '@/images/cource-media.jpeg';
import Image from 'next/image';
import PlayButton from '@/images/svg/play-button.svg';
import Button from '../button/Button';
import { useRouter } from 'next/router';
import Link from 'next/link';
import VideoPlayer from '../video_player/videoPlayer';
import LessonTimeline from '../lesson_timeline/lessonTimeline';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_STAGE_STATUS, CHANGE_STAGE_STATUS } from '@/graphql/queries';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { stageData } from '@/lib/dump-data/lessonsData';

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
  const [changeStageStatus, { data }] = useMutation(CHANGE_STAGE_STATUS);
  // addStageStatus({ variables: { stageId: 1, userId: 1, status: 'new' } });
  useEffect(() => {
    if (finishedStage) {
      const a = changeStageStatus({
        variables: {
          stageId: Number(lesson.lessonStages[Number(currentStageId) - 1].id),
          userId: Number(cc?.userId),
          status: 'finished',
        },
      }).then((res) => {
        console.log('res', res, lesson);
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
    <>
      <section className="cource-lesson-header">
        <div className="cource-lesson-header__content">
          <h1 className="cource-lesson-header__title">
            <span className="cource-lesson-header__title-counter">
              {lesson.lessonNumber + '.'}
            </span>
            <span className="cource-lesson-header__title-text">
              {lesson.lessonName}
            </span>
          </h1>
          <div className="cource-lesson-header__subtitle">
            <span className="cource-lesson-header__subtitle-counter">
              {lesson.lessonNumber + '.' + currentStageId}
            </span>
            <span className="cource-lesson-header__subtitle-text">
              {currentStageId &&
                lesson.lessonStages[Number(currentStageId) - 1] &&
                lesson.lessonStages[Number(currentStageId) - 1].stageName}
            </span>
          </div>
          <div className="cource-lesson-header__info">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  lesson.lessonStages[Number(currentStageId) - 1]
                    .stageDescription,
              }}
            />
            {/* <p>
            Старшие Арканы имеют глубинную символику и серьезное значение...
          </p>
          <p>
            Каждый из Старших Арканов имеет индивидуальный номер – от I до
            XXI...
          </p>
          <p>
            Цель человеческой жизни – путь к себе, достижение целостности...
          </p>
          <p>
            Последовательность Старших Арканов символизирует человеческую
            жизнь...
          </p> */}
          </div>
          {/* <div
          className="cource-lesson-header__media js-modal-open"
          data-modal="video-modal"
        >
          <Image
            className="cource-lesson-header__media-img"
            src={courseMedia}
            alt=""
          />
          <div className="cource-lesson-header__media-button">
            <PlayButton />
          </div>
        </div> */}
          <VideoPlayer
            url={`https://storage.yandexcloud.net/omen-course/${currentLessonId}_${currentStageId}.mp4`}
            preview={`/preview/${currentLessonId}_${currentStageId}.png`}
            finished={finishedStage}
            setFinished={setFinishedStage}
            stageId={lesson.lessonStages[Number(currentStageId) - 1]}
          />
        </div>
        <div className="cource-lesson-header__navigation">
          {currentStageId !== '1' && (
            <Button
              className={
                'cource-lesson-header__navigation-item cource-lesson-header__navigation-item_back button_ternary '
              }
              isLink
              isLesson
              onClick={previousButtonClickHandler}
            >
              <span className="cource-lesson-header__navigation-item-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 18 16"
                  fill="none"
                >
                  <path
                    d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM17 9C17.5523 9 18 8.55228 18 8C18 7.44772 17.5523 7 17 7V9ZM1 9H17V7H1V9Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="cource-lesson-header__navigation-item-title">
                Назад
              </span>
            </Button>
          )}
          {nextStageExists && (
            <Button
              className={
                'cource-lesson-header__navigation-item cource-lesson-header__navigation-item_next ' +
                (nextStageExists &&
                  currentStageId == '1' &&
                  'cource-lesson-header__navigation-item_to-list')
              }
              isLink
              isLesson
              onClick={nextButtonClickHandler}
            >
              <span className="cource-lesson-header__navigation-item-title">
                Вперед
              </span>
              <span className="cource-lesson-header__navigation-item-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 19 16"
                  fill="none"
                >
                  <path
                    d="M1.5 7C0.947715 7 0.5 7.44772 0.5 8C0.5 8.55228 0.947715 9 1.5 9V7ZM18.2071 8.70711C18.5976 8.31658 18.5976 7.68342 18.2071 7.29289L11.8431 0.928932C11.4526 0.538408 10.8195 0.538408 10.4289 0.928932C10.0384 1.31946 10.0384 1.95262 10.4289 2.34315L16.0858 8L10.4289 13.6569C10.0384 14.0474 10.0384 14.6805 10.4289 15.0711C10.8195 15.4616 11.4526 15.4616 11.8431 15.0711L18.2071 8.70711ZM1.5 9H17.5V7H1.5V9Z"
                    fill="white"
                  />
                </svg>
              </span>
            </Button>
          )}
          <Link
            href="/courses"
            className="cource-lesson-header__navigation-item cource-lesson-header__navigation-item_to-list"
            // onClick={(e) => {
            //   router.push(`/courses`);
            // }}
          >
            <span className="cource-lesson-header__navigation-item-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 16"
                fill="none"
              >
                <path
                  d="M0.292893 7.29289C-0.0976311 7.68342 -0.0976311 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM17 9C17.5523 9 18 8.55228 18 8C18 7.44772 17.5523 7 17 7V9ZM1 9H17V7H1V9Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="cource-lesson-header__navigation-item-title">
              Вернуться к списку уроков
            </span>
          </Link>
        </div>
      </section>
      <LessonTimeline stage={lesson.lessonStages[Number(currentStageId) - 1]} />
    </>
  );
}
