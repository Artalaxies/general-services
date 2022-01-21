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
        <span className="logo">Artlaxies LLC</span>
        <p> All Rights Reserved</p>
      </div>
      <div className="footer-links_div">
        <h4>Links</h4>
        <p onClick={() => window.open('https://www.linkedin.com/company/artalaxies-llc/?viewAsMember=true')}>Social Media</p>
      </div>
      <div className="footer-links_div">
        <h4>Company</h4>
        <p onClick={() => window.open('/term-of-conditions.html')}>Terms & Conditions </p>
        <p onClick={() => window.open('/privacy-policy.html')}>Privacy Policy</p>
        <p onClick={() => window.open('/cookie-policy.html')}>Cookie Policy</p>
        <p onClick={() => window.open('/disclaimer.html')}>Disclaimer</p>
      </div>
      <div className="footer-links_div">
        <h4>Get in touch</h4>
        <p onClick={() => window.open('mailto:contract@artalaxies.com')}>Contact</p>
        <p onClick={() => window.open('mailto:contract@artalaxies.com')}>contract@artalaxies.com</p>
        <p onClick={() => window.open('https://app.termly.io/notify/5f6359b7-7a8a-44c8-94e6-004523afb1c6')}>Do not sell my info</p>
      </div>
    </div>

    <div className="footer-copyright">
      <p>@2022 Artalaxies LLC All rights reserved.</p>
    </div>
  </div>
);

export default Footer;
