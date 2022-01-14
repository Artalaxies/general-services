import React from 'react';
import antitoxicLogo from '../../assets/antitoxic_logo.png';
import artalaxiesWhiteLogo from '../../assets/artalaxies_white.png';
import communityLogo from '../../assets/community.png';
import ai from '../../assets/artalaxies_logo.png';

import './header.css';

const Header = () => (
  <div className="header section__padding" id="home">
    <div className="header-content">
      <h1 className="gradient__text">Enhance Web 3.0 with Artalaxies Platform to the Multi-Metaverses</h1>
      <p>Artalaxies LLC is a software development company. We are focusing on using the Web 3.0 tech stack to build decentralized applications for the next generation of internet experience. Discover the use of blockchain for existing problems. Use our platforms to secure and mint your own artwork and products with blockchain technology, and explore the idea of how to bring NFTs into the physical world.</p>
      {/* <div className="header-content__input">
        <input type="email" placeholder="Your Email Address" />
        <button type="button">Get Started</button>
      </div> */}

      <div className="header-content__button_group">
        <button type="button"><img src={antitoxicLogo} /> Antitoxic </button>
        <button type="button"><img src={artalaxiesWhiteLogo} /> Marketplace </button>
        <button type="button"><img src={communityLogo} /> Community </button>
      </div>
      {/* <div className="header-content__people">
        <img src={people} />
        <p>1,600 people requested access a visit in last 24 hours</p>
      </div> */}
    </div>
    <div className="gpt3__header-image">
      <img src={ai} />
    </div>
  </div>
);

export default Header;
