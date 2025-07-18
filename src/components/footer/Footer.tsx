import React from 'react';
import Logo from '@/components/logo/Logo'; // Assuming Logo component is in the components/logo directory
import './footer.scss';

const Footer = () => (
  <footer className="footer">
    <div className="footer__wrapper">
      {/* Company Info Block */}
      <div className="footer__company-info">
        <div className="footer__company-name">ИП Фамилия И.О.</div>
        <div className="footer__company-details">ИНН 78190460778 ОГРН 31878899550066</div>
      </div>
      {/* Social Icons */}
      <div className="footer__socials">
        <a href="https://instagram.com" className="footer__social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <span className="footer__icon-bg">
            <img src="/images/Instagram.png" alt="Instagram" className="footer__icon-img" width={24} height={24} />
          </span>
        </a>
        <a href="https://telegram.org" className="footer__social-icon" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
          <span className="footer__icon-bg">
            <img src="/images/telegram.png" alt="Telegram" className="footer__icon-img" width={24} height={24} />
          </span>
        </a>
      </div>
      {/* Policy Link */}
      <div className="footer__policy">Политика в отношении пользовательских данных</div>
      {/* Copyright */}
      <div className="footer__copyright">2025 Все права защищены</div>
    </div>
  </footer>
);

export default Footer;
