/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import './footer.css';

const Footer = () => (
  <div className="footer section__padding">
    {/* <div className="footer-heading">
      <h1 className="gradient__text">Do you want to step in to the future before others</h1>
    </div> */}

    {/* <div className="footer-btn">
      <p>Request Early Access</p>
    </div> */}

    <div className="footer-links">
      <div className="footer-links_logo">
        <span className="logo">Artlaxies</span>
      </div>
      <div className="footer-links_div">
        <h4>Links</h4>
        <p onClick={() => window.open('https://www.linkedin.com/company/artalaxies-llc/?viewAsMember=true')}>Social Media</p>
        <p>Contact</p>
      </div>
      <div className="footer-links_div">
        <h4>Company</h4>
        <p>Terms & Conditions </p>
        <p>Privacy Policy</p>
      </div>
      <div className="footer-links_div">
        <h4>Get in touch</h4>
        <p>contract@artalaxies.com</p>
      </div>
    </div>

    <div className="footer-copyright">
      <p>@2022 Artalaxies All rights reserved.</p>
    </div>
  </div>
);

export default Footer;
