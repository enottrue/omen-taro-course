import { Key } from 'react';
import './lessonTimeline.css';

function LessonTimeline(stage: any) {
  const sections = stage.stage.stageTimecodes 
    ? [...stage.stage.stageTimecodes].sort((a: any, b: any) => a.id - b.id)
    : Array.from({ length: 11 }, (_, i) => i + 1);
  console.log(stage.stage.stageTimecodes, 11);
  return (
    <div className="lesson-timeline-wrapper">
      <h3 className="lesson-timeline-title">Timeline</h3>
      
      <div className="lesson-timeline-content">
        {sections.map((section: any, i: number) => {
          return (
            <div key={i} className="lesson-timeline-item">
              <span className="lesson-timeline-time">
                {section.timeCodeStart || `${i + 1}:00`}
              </span>
              <span className="lesson-timeline-text">
                {section.name || `Section ${i + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LessonTimeline;
