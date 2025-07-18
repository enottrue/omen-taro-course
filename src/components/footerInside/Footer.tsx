import React from 'react';
import './footer.scss';

const FooterInside = () => (
  <div className="footer-inside">
    {/* Ellipse background */}
    <div className="footer-inside__ellipse" />
    {/* Decorative images (use placeholders) */}
 
    {/* Content block */}
    <div className="footer-inside__content">
      <span className="footer-inside__cosmo">Cosmo.</span><span className="footer-inside__irena">Irena</span>
    </div>
  </div>
);

export default FooterInside;
