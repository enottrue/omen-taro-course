import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import styles from './TestimonialsSlider.module.css';
import Icon1 from '@/images/1@2x.png';
import Icon2 from '@/images/2@2x.png';
import Icon3 from '@/images/3@2x.png';
import Icon4 from '@/images/4@2x.png';
import Icon5 from '@/images/5@2x.png';
import Icon6 from '@/images/6@2x.png';
import Icon7 from '@/images/7@2x.png';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import custom Swiper styles to override defaults
import './swiper-custom.css';

// Test data for testimonials
const testimonials = [
  {
    id: 1,
    text: "I used to depend on astrologers for answers. Now I analyze my chart, spot ideal timing, and make confident decisions—no more waiting for someone else's opinion",
    author: "Jessica, 37",
    avatar: Icon1
  },
  {
    id: 2,
    text: "Finally understand why some jobs drained me while others felt effortless. No more guesswork—just intentional choices aligned with my chart.",
    author: "Amanda, 34",
    avatar: Icon2
  },
  {
    id: 3,
    text: "Not an astrologer, but I can now decode financial aspects in any chart. This is a lifelong skill I'll keep using.",
    author: "Renee, 42",
    avatar: Icon3
  },
  {
    id: 4,
    text: "My husband and I checked his chart before launching a project—turns out we picked the worst possible time. We delayed, and it saved us.",
    author: "Christine, 39",
    avatar: Icon4
  },
  {
    id: 5,
    text: "Never thought I'd 'get' astrology, but the step-by-step method made it click. Did my friend's forecast—and shocked her with how accurate it was.",
    author: "Lauren, 31",
    avatar: Icon5
  },
  {
    id: 6,
    text: "My best friend and I took the course together. Wine + chart readings became our thing—and we discovered hidden strengths we'd overlooked.",
    author: "Brooke, 35",
    avatar: Icon6
  },
  {
    id: 7,
    text: "Now I create yearly money forecasts for my whole family. We plan vacations, career shifts, even home purchases—all timed right.",
    author: "Michelle, 41",
    avatar: Icon7
  }
  
];

const TestimonialsSlider: React.FC = () => {
  return (
    <div className={styles.testimonialsSlider}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          type: 'bullets'
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className={styles.swiper}
        style={{ width: '100%' }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className={styles.slide}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <div className={styles.testimonialText}>
                  "{testimonial.text}"
                </div>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className={styles.authorName}>
                    <strong>{testimonial.author}</strong>
                  </div>
                </div>
                {/* <div className={styles.starsRating}>
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className={styles.star} />
                  ))}
                </div> */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialsSlider; 