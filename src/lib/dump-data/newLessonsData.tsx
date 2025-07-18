// New lessons data based on actual dumps
export const coursesData = [
  {
    id: 1,
    name: "Money Compass - Astrology Course for Financial Success",
    createdAt: "2025-07-10T06:08:55.305Z",
    updatedAt: "2025-07-10T06:08:55.305Z"
  }
];

export const lessonsData = [
  {
    id: 1,
    lessonNumber: 1,
    lessonName: "Module 1 - Introduction to the Birth Chart",
    lessonDescription: "Learn the fundamentals of building and reading your birth chart to understand your astrological blueprint.",
    lessonTimecodes: [
      "00:00",
      "01:00", 
      "02:00"
    ],
    lessonStatus: "new",
    courseId: 1,
    createdAt: "2025-07-10T06:08:55.455Z",
    updatedAt: "2025-07-10T06:08:55.455Z"
  },
  {
    id: 2,
    lessonNumber: 2,
    lessonName: "Module 2 - Dream Job & High-Income Careers",
    lessonDescription: "Discover your most lucrative career paths and learn how to land high-paying jobs based on your astrological profile.",
    lessonTimecodes: [
      "00:00",
      "01:00",
      "02:00"
    ],
    lessonStatus: "new",
    courseId: 1,
    createdAt: "2025-07-10T06:08:55.469Z",
    updatedAt: "2025-07-10T06:08:55.469Z"
  },
  {
    id: 3,
    lessonNumber: 3,
    lessonName: "Module 3 - Money Energy",
    lessonDescription: "Activate your wealth flow and master smart money management techniques to grow your capital.",
    lessonTimecodes: [
      "00:00",
      "01:00",
      "02:00"
    ],
    lessonStatus: "new",
    courseId: 1,
    createdAt: "2025-07-10T06:08:55.474Z",
    updatedAt: "2025-07-10T06:08:55.474Z"
  },
  {
    id: 4,
    lessonNumber: 4,
    lessonName: "Module 4 - Quick Cash Strategies",
    lessonDescription: "Pinpoint quick-income opportunities in your chart and learn strategies for fast financial gains.",
    lessonTimecodes: [
      "00:00",
      "01:00",
      "02:00"
    ],
    lessonStatus: "new",
    courseId: 1,
    createdAt: "2025-07-10T06:08:55.479Z",
    updatedAt: "2025-07-10T06:08:55.479Z"
  },
  {
    id: 5,
    lessonNumber: 5,
    lessonName: "Module 5 - Avoiding Burnout & Loving What You Do",
    lessonDescription: "Create a work environment that keeps you energized and aligned with your true purpose.",
    lessonTimecodes: [
      "00:00",
      "01:00",
      "02:00"
    ],
    lessonStatus: "new",
    courseId: 1,
    createdAt: "2025-07-10T06:08:55.482Z",
    updatedAt: "2025-07-10T06:08:55.482Z"
  }
];

// Stages data with timecodes
export const stageData = [
  {
    id: 1,
    stageNumber: 1,
    stageName: "Lesson 1 - The Basics — How to Build and Read Your Birth Chart",
    stageDescription: "<p>Learn the fundamental principles of astrology and how to construct your birth chart. Discover the meaning of planets, houses, and aspects that make up your unique astrological blueprint.</p><p>This foundational lesson will give you the tools to understand your personal astrological profile and how it influences your career and financial potential.</p>",
    lessonId: 1,
    stageTimecodes: [
      {
        id: 1,
        name: "Introduction to Birth Charts",
        timeCodeStart: "0:00",
        timeCodeEnd: "5:00",
        stageId: 1,
        createdAt: "2025-07-10T06:08:55.494Z",
        updatedAt: "2025-07-10T06:08:55.494Z"
      },
      {
        id: 2,
        name: "Understanding Planets and Their Meanings",
        timeCodeStart: "5:00",
        timeCodeEnd: "15:00",
        stageId: 1,
        createdAt: "2025-07-10T06:08:55.501Z",
        updatedAt: "2025-07-10T06:08:55.501Z"
      },
      {
        id: 3,
        name: "Houses and Their Significance",
        timeCodeStart: "15:00",
        timeCodeEnd: "25:00",
        stageId: 1,
        createdAt: "2025-07-10T06:08:55.504Z",
        updatedAt: "2025-07-10T06:08:55.504Z"
      },
      {
        id: 4,
        name: "Aspects and Their Impact",
        timeCodeStart: "25:00",
        timeCodeEnd: "35:00",
        stageId: 1,
        createdAt: "2025-07-10T06:08:55.507Z",
        updatedAt: "2025-07-10T06:08:55.507Z"
      },
      {
        id: 5,
        name: "Practical Chart Reading Exercise",
        timeCodeStart: "35:00",
        timeCodeEnd: "45:00",
        stageId: 1,
        createdAt: "2025-07-10T06:08:55.510Z",
        updatedAt: "2025-07-10T06:08:55.510Z"
      }
    ]
  },
  {
    id: 2,
    stageNumber: 2,
    stageName: "Lesson 2 - Discover Your Most Lucrative Career Paths",
    stageDescription: "<p>Explore how your birth chart reveals your natural talents and the career paths where you can excel and earn the highest income. Learn to identify the planetary combinations that indicate financial success.</p>",
    lessonId: 2,
    stageTimecodes: [
      {
        id: 6,
        name: "Career Indicators in Your Chart",
        timeCodeStart: "0:00",
        timeCodeEnd: "8:00",
        stageId: 2,
        createdAt: "2025-07-10T06:08:55.536Z",
        updatedAt: "2025-07-10T06:08:55.536Z"
      },
      {
        id: 7,
        name: "High-Income Career Archetypes",
        timeCodeStart: "8:00",
        timeCodeEnd: "18:00",
        stageId: 2,
        createdAt: "2025-07-10T06:08:55.539Z",
        updatedAt: "2025-07-10T06:08:55.539Z"
      },
      {
        id: 8,
        name: "Your Unique Career Blueprint",
        timeCodeStart: "18:00",
        timeCodeEnd: "28:00",
        stageId: 2,
        createdAt: "2025-07-10T06:08:55.547Z",
        updatedAt: "2025-07-10T06:08:55.547Z"
      }
    ]
  },
  {
    id: 3,
    stageNumber: 3,
    stageName: "Lesson 3 - How to Land a High-Paying Job",
    stageDescription: "<p>Master the strategies to leverage your astrological profile in job interviews and career negotiations. Learn how to present yourself in a way that aligns with your chart's strengths.</p>",
    lessonId: 2,
    stageTimecodes: [
      {
        id: 9,
        name: "Interview Strategies Based on Your Chart",
        timeCodeStart: "0:00",
        timeCodeEnd: "10:00",
        stageId: 3,
        createdAt: "2025-07-10T06:08:55.558Z",
        updatedAt: "2025-07-10T06:08:55.558Z"
      },
      {
        id: 10,
        name: "Negotiation Techniques",
        timeCodeStart: "10:00",
        timeCodeEnd: "20:00",
        stageId: 3,
        createdAt: "2025-07-10T06:08:55.560Z",
        updatedAt: "2025-07-10T06:08:55.560Z"
      },
      {
        id: 11,
        name: "Timing Your Career Moves",
        timeCodeStart: "20:00",
        timeCodeEnd: "30:00",
        stageId: 3,
        createdAt: "2025-07-10T06:08:55.563Z",
        updatedAt: "2025-07-10T06:08:55.563Z"
      }
    ]
  },
  {
    id: 4,
    stageNumber: 4,
    stageName: "Lesson 4 - Practical Steps to Activate Wealth Flow",
    stageDescription: "<p>Learn specific techniques to activate the wealth-generating potential in your birth chart. Discover daily practices that align your energy with financial abundance.</p>",
    lessonId: 3,
    stageTimecodes: [
      {
        id: 12,
        name: "Wealth Activation Rituals",
        timeCodeStart: "0:00",
        timeCodeEnd: "12:00",
        stageId: 4,
        createdAt: "2025-07-10T06:08:55.572Z",
        updatedAt: "2025-07-10T06:08:55.572Z"
      },
      {
        id: 13,
        name: "Daily Money Practices",
        timeCodeStart: "12:00",
        timeCodeEnd: "22:00",
        stageId: 4,
        createdAt: "2025-07-10T06:08:55.575Z",
        updatedAt: "2025-07-10T06:08:55.575Z"
      }
    ]
  },
  {
    id: 5,
    stageNumber: 5,
    stageName: "Lesson 5 - Smart Money Management & Growing Your Capital",
    stageDescription: "<p>Master the art of managing and growing your wealth based on your astrological profile. Learn investment strategies that align with your chart's financial indicators.</p>",
    lessonId: 3,
    stageTimecodes: [
      {
        id: 14,
        name: "Investment Strategies for Your Chart",
        timeCodeStart: "0:00",
        timeCodeEnd: "15:00",
        stageId: 5,
        createdAt: "2025-07-10T06:08:55.580Z",
        updatedAt: "2025-07-10T06:08:55.580Z"
      },
      {
        id: 15,
        name: "Risk Management Based on Your Profile",
        timeCodeStart: "15:00",
        timeCodeEnd: "25:00",
        stageId: 5,
        createdAt: "2025-07-10T06:08:55.585Z",
        updatedAt: "2025-07-10T06:08:55.585Z"
      }
    ]
  },
  {
    id: 6,
    stageNumber: 6,
    stageName: "Lesson 6 - Pinpointing Quick-Income Opportunities in Your Chart",
    stageDescription: "<p>Identify the specific planetary transits and aspects that indicate quick-income opportunities. Learn to recognize and act on these windows of financial potential.</p>",
    lessonId: 4,
    stageTimecodes: [
      {
        id: 16,
        name: "Quick-Income Indicators",
        timeCodeStart: "0:00",
        timeCodeEnd: "12:00",
        stageId: 6,
        createdAt: "2025-07-10T06:08:55.590Z",
        updatedAt: "2025-07-10T06:08:55.590Z"
      },
      {
        id: 17,
        name: "Timing Your Financial Moves",
        timeCodeStart: "12:00",
        timeCodeEnd: "22:00",
        stageId: 6,
        createdAt: "2025-07-10T06:08:55.595Z",
        updatedAt: "2025-07-10T06:08:55.595Z"
      }
    ]
  },
  {
    id: 7,
    stageNumber: 7,
    stageName: "Lesson 7 - Creating a Work Environment That Keeps You Energized and Aligned",
    stageDescription: "<p>Design a work environment and lifestyle that supports your astrological needs and prevents burnout. Learn to create sustainable success that aligns with your true nature.</p>",
    lessonId: 5,
    stageTimecodes: [
      {
        id: 18,
        name: "Work Environment Design",
        timeCodeStart: "0:00",
        timeCodeEnd: "15:00",
        stageId: 7,
        createdAt: "2025-07-10T06:08:55.600Z",
        updatedAt: "2025-07-10T06:08:55.600Z"
      },
      {
        id: 19,
        name: "Burnout Prevention Strategies",
        timeCodeStart: "15:00",
        timeCodeEnd: "25:00",
        stageId: 7,
        createdAt: "2025-07-10T06:08:55.605Z",
        updatedAt: "2025-07-10T06:08:55.605Z"
      },
      {
        id: 20,
        name: "Sustainable Success Practices",
        timeCodeStart: "25:00",
        timeCodeEnd: "35:00",
        stageId: 7,
        createdAt: "2025-07-10T06:08:55.610Z",
        updatedAt: "2025-07-10T06:08:55.610Z"
      }
    ]
  }
]; 