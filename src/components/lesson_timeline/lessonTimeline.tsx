import { Key } from 'react';

function LessonTimeline(stage: any) {
  const sections =
    stage.stage.stageTimecodes || Array.from({ length: 11 }, (_, i) => i + 1);
  console.log(stage.stage.stageTimecodes, 11);
  return (
    <section className="cource-lesson-content">
      <div className="cource-lesson-content__info">
        <h3>Таймкоды</h3>
        {sections.map((section: any, i: Key) => {
          return (
            <p key={i}>
              <strong>{section.timeCodeStart}</strong> - {section.name}
            </p>
          );
        })}
      </div>
    </section>
  );
}

export default LessonTimeline;
