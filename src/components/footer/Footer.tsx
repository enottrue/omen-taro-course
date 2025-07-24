import React from 'react';
import './footer.scss';

const Footer = () => (
  <footer className="footer">
    <div className="footer__wrapper">
      {/* Privacy Policy */}
      <div className="footer__policy">Privacy Policy</div>
      
      {/* Social Icons */}
      <div className="footer__socials">
        <a href="https://www.instagram.com/cosmo.irena" className="footer__social-icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <span className="footer__icon-bg">
            <img src="/images/Instagram.png" alt="Instagram" className="footer__icon-img" width={24} height={24} />
          </span>
        </a>
      </div>
      
      {/* Copyright */}
      <div className="footer__copyright">2025 All rights are protected</div>
      
      {/* Authors */}
      <div className="footer__authors">
        Елена и Виктор Воробьевы<br />
        Ноябрь, 2022 — Февраль, 2023
      </div>
    </div>
  </footer>
);

export default Footer;
