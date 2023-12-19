import Image from 'next/image';
import ToLearnLike from '@/images/svg/to-learn-like.svg';
import toLearnImg from '@/images/to-learn.png';

export default function ToLearn() {
  return (
    <section className="to-learn">
      <div className="to-learn__grid">
        <div className="to-learn__card">
          <h2 className="to-learn__title">Научитесь быстро читать расклады</h2>
          <p>
            универсальной колоды Таро, используя подробные трактовки карт
            в&nbsp;удобном формате
          </p>
        </div>
        <div className="to-learn__illustration">
          <Image src={toLearnImg} alt="" />
          <div className="to-learn__illustration-text">
            <div className="to-learn__illustration-text-desc">
              Благодарим
              <br />
              за переход
              <br />
              по QR-коду
              <br />
              и приветствуем
              <br />
              на обучающем
              <br />
              курсе!
            </div>
            <div className="to-learn__illustration-text-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 34 33"
                fill="none"
              >
                <path
                  d="M17 8.0748C14.981 5.04428 9.54032 -0.633972 3.92962 0.897241C-3.08376 2.81126 2.97325 23.8654 17 32"
                  stroke="white"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M17 8.0748C19.019 5.04428 24.4597 -0.633972 30.0704 0.897241C37.0838 2.81126 31.0268 23.8654 17 32"
                  stroke="white"
                  strokeLinecap="round"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="to-learn__card">
          <p>
            Курс снят по&nbsp;книге &laquo;Настоящее таро Уэйта. История
            создания и&nbsp;тайны вокруг колоды.&nbsp;1919&nbsp;г.&raquo;
            и&nbsp;обучит вас работе с&nbsp;самой известной колодой в&nbsp;мире.
          </p>
        </div>
      </div>
    </section>
  );
}
