import React, { useState, useRef, useEffect } from 'react';
import book from '@/images/tu@2x.png';
import Image from 'next/image';
import Button from '../button/Button';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import styles from '@/components/component1/component1.module.scss';
import unsplashImage from '../../images/unsplashutbx9x3y8ly-2@2x.png';
import image3 from '../../images/image-3@2x.png';
import BurgerMenu from '../component1/BurgerMenu';

const TextBlock = () => {
  const router = useRouter();
  const cc = useContext(MainContext);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = !!(cc?.token && cc?.user);

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

  return (
    <div className="root">
      <div className="">
        <Image
          className="unsplashutbx9x3y8ly-icon"
          alt="Background"
          src={unsplashImage}
          width={484}
          height={1853}
          priority
        />        
        <Image
          className="image-3-icon"
          alt=""
          src={image3}
          width={584}
          height={283}
          priority
        />
      </div>

      <section className="root-inner">
        <div className="frame-parent">
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
                href="mailto:support@astro-irena.com?subject=Вопрос по методичке Таро&body=Здравствуйте! У меня есть вопрос по методичке Таро:"
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
      
          
          <div className="frame-div">
            <div className="frame-parent1">
              <div className="frame-parent2">
                <div className="parent">
                  <h3 className="cosmo">
                    <p className="p">Privacy Policy</p>
                  </h3>
                </div>
                
                <div className="div1">
                  <p className="p">
                    <strong>PERSONAL DATA PROTECTION POLICY - TREATMENT OF YOUR DATA</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    ONIEXP OÜ ensures the protection of your personal information when you use our services.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Data protection is a matter of trust and your trust in ONIEXP OÜ matters to us. We have therefore composed guidelines ensuring that the privacy of our customers is not violated. The privacy policy can be changed at all times, and the latest version is always available on our website.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>COLLECTION OF PERSONAL DATA, PURPOSE AND LAWFULNESS OF PROCESSING</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    When you use our website and/or one of our services, personal data about you will be collected. The personal data collected by us may include, for instance, your name, your email address, and similar identification data, information about an online purchase, and about your navigation on the website.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    The collection of your personal data, as well as the purpose and the lawfulness of processing your personal data, is based on one or more applicable laws:
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • When you buy goods online at astro-irena.com. The purpose of us collecting your data in this way is to complete your online purchase in our webshop, as well as to comply with additional laws, such as bookkeeping and accounting law. The applicable law for the collection and treatment of this data is the General Data Protection Regulation, article 6, 1 (b and c).
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • When you sign up for ONIEXP OÜ's newsletter. The purpose of us collecting your data in this way is to send you newsletters. The applicable law for the collection and treatment is the General Data Protection Regulation, article 6, 1, (a).
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • When you create a client account or sign up for a customer club/loyalty club at ONIEXP OÜ. The purpose of us collecting your data in this way is to be able to administrate your membership and provide the services and perks that come with the membership. The applicable law for the collection and treatment is the General Data Protection Regulation, article 6, 1, (b or f).
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Please note that we will only use your personal data to send marketing material if you have previously given your explicit consent unless legislation allows us to contact you without your prior consent.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    GIOTRADE keeps statistics about which areas of the site our users visit and which products the users prefer. This data does not contain personal data. Knowledge about the users' use of the website is gained with help from the collected data. This information is used to improve the website. We do use data about how our users navigate, to better understand how our users use astro-irena.com, and from that we try to improve the website. We are not able to see where you come from or where you are going on the internet after you leave our site. Furthermore, we collect information about what products our users, as a unit, prefer. This information is also used to improve the website. We do not sell or otherwise disclose information about how our users navigate and use our website. We do not sell or disclose information about your purchase history to third parties.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>TRANSFER TO OTHER DATA CONTROLLERS</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    In general, we do not transfer your personal data to a third party without your consent. However, information that is used for the delivery of goods will be transferred to the shipping company used by ONIEXP OÜ.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Under specific circumstances and with reference to legislation, it might be necessary to transfer information to public authorities or the police. For example, information may be disclosed to the police if we suspect credit card fraud.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    In the case of a re-organization, full or partial sale of the company, any disclosure in such connection will be in accordance with current legislation for the processing of personal data.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>DISCLOSURE TO DATA PROCESSORS</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Your personal data is disclosed to partners of ONIEXP OÜ who deliver services on behalf of ONIEXP OÜ, for example in relation to newsletter distribution. These partners only process the personal data on behalf of ONIEXP OÜ and in accordance with the instructions of ONIEXP OÜ. ONIEXP OÜ has written guarantees from all third party companies working with ONIEXP OÜ that they, just as ONIEXP OÜ, comply with the Council's directive (95/46/EC) on data protection.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>DELETION OF PERSONAL DATA</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    We will delete your personal data when we no longer need to process them in relation to one or more of the purposes set out above in section 3. However, the data may be processed and stored for a longer period in anonymized form.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • All online purchase data will be saved for up to 3 years after the end of the calendar year of when the purchase was completed. Financial data will be saved for up to 5 years after the end of the calendar year of when the purchase is completed.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • When unsubscribing from our newsletter your data will immediately be unsubscribed, however documentation for your original permission will be saved for 2 years.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • If you unsubscribe to the client club, your membership will be deleted immediately, however documentation for your original permission will be saved for 2 years.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>YOUR RIGHTS</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    You are at any time entitled to be informed of the personal data about you that we process, but with certain legislative exceptions. You also have the right to object to the collection and further processing of your personal data.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>WITHDRAWAL OF CONSENT</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    You may, at any time, withdraw any consent you have given and we will delete your personal data, unless we can continue the processing based on another purpose. If you wish to withdraw your consent, please contact us at info@astro-irena.com
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>LINKS TO OTHER WEBSITES ETC.</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Our website may contain links to other websites or to integrated sites. We are not responsible for the contents of the websites of other companies or for the practices of such companies regarding the collection of personal data. When you visit other websites, you should read the owners' policies on the protection of personal data and other relevant policies.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    If you want us to update, amend or delete the personal data that we have recorded about you, wish to get access to the data being processed about you, or if you have any questions concerning the above guidelines, you may contact us at info@astro-irena.com.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>COMPLAINTS</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    If you wish to appeal against the processing of your personal data, please contact us by email, telephone, or letter as indicated in section 14 above. You may also contact the Data Protection Agency, Borgergade 28, 5., 1300 Copenhagen K.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>CUSTOMER APPROVAL</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    By using ONIEXP OÜ's website, you approve the collection of information by ONIEXP OÜ as described in this document.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>ACCOUNT</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    In your account, you'll see your order history, order status, tracking, marketing preferences, payment preferences, and other account features.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Also, you'll be able to save items in your shopping cart and rate and review the products you've purchased. We'll be able to offer size recommendations and suggest products to help provide a better customer experience to you and others.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    We store the following personal data in your account if you actively decide to provide it to us:
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • Contact information (name, address, phone, email)
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • Country
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • Account settings
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • Favorite payment method
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    If you purchase with your account, we'll store and provide you with the following information when you log in:
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • Order history
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • Delivery information such as tracking number
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Your personal data, connected to your ONIEXP OÜ account, is handled and stored in the same way we handle data connected to purchases. We will keep your data for as long as you have an active ONIEXP OÜ account. You can, at any time, delete your ONIEXP OÜ account.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>AUTOFILL IN CHECKOUT</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    To smoothen the process of making a purchase, ONIEXP OÜ offers autofill at checkout. Autofill only works if you have made a purchase at ONIEXP OÜ before.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    When you purchase for the first time at ONIEXP OÜ, you accept that we store the value of the "frontend" cookie that is placed on your device.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    When you return to make another purchase, our system checks to see if you've made a purchase before by checking if your email address has been used previously. At the same time, we check if the "frontend" cookie value on your device is the same as the value stored. If both the email and cookie value are identified, ONIEXP OÜ autofills your name and address.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>PICTURES AND PERSONALIZATION CONTENT</strong>
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • ONIEXP OÜ is entitled but not obligated to review the legality of any picture or other personalization content provided by the customer. If ONIEXP OÜ considers the material to violate applicable law or these terms and conditions, ONIEXP OÜ is entitled to remove this content without prior notice.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • The customer is responsible for ensuring that all pictures and other uploaded content are free of third-party rights. You must own the content you upload to ONIEXP OÜ or have full authority to upload it. ONIEXP OÜ will not be held liable if a customer infringes on third-party rights. The same applies to claims based on infringement of these terms and conditions.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • The customer is solely responsible for pictures submitted and any other personalization content. Unlawful material or content that violates applicable regulations or is likely to insult, defame, harass, or otherwise harm other individuals is not permissible. In case of violations, ONIEXP OÜ reserves the right to remove all pictures and/or other personalization content and refuse to complete the requested service.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • The customer agrees not to upload or otherwise transmit material containing software viruses or other computer code, files, or programs that can interrupt, destroy, or restrain the functionality of computer software, hardware, or telecommunication devices.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    • Any picture or other material for personalization provided by the customer will be made available by ONIEXP OÜ until the purchase is finalized or for a maximum of 24 months. After the expiration of this term, the image material will be removed by ONIEXP OÜ.
                  </p>
                </div>
              </div>
{/* 
              <div className="cource-book__button">
                <Button
                  title="Download Policy"
                  isLink
                  href="/privacy-policy.pdf"
                  target="_blank"
                  className="enroll-now-only-50-wrapper"
                >
                  <span className="cource-book__icon-download">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.09466 1.48537L8 11.4849" stroke="#002B80" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M15 16.0668H1" stroke="#002B80" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M2.29676 6.59003L7.24651 11.5398C7.63703 11.9303 8.2702 11.9303 8.66072 11.5398L13.6105 6.59003" stroke="#002B80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.29676 6.59003L7.24651 11.5398C7.63703 11.9303 8.2702 11.9303 8.66072 11.5398L13.6105 6.59003" stroke="#002B80" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция с кнопкой назад */}
     
      
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
};

export default TextBlock;
