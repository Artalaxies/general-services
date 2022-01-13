import React from 'react';
import people from '../../assets/people.png';
import antitoxicLogo from '../../assets/antitoxic_logo.png';
import artalaxiesWhiteLogo from '../../assets/artalaxies_white.png';

import communityLogo from '../../assets/community.png';
import './header.css';

const Header = () => (
  <div className="gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
      <h1 className="gradient__text">Enhance Web 3.0 with Artalaxies Platform</h1>
      <p>Artalaxies is a decentralized marketplace that focuses on providing anonomyous art designers a platform to produce and protect their NFT derivatives with the use of web 3.0 tech stack and e-commerce system. The platform allows for buyers to purchase physical products that have the nft content embedded, without the artist loosing ownership of the NFT itself.</p>

      {/* <div className="gpt3__header-content__input">
        <input type="email" placeholder="Your Email Address" />
        <button type="button">Get Started</button>
      </div> */}

      <div className="gpt3__header-content__button_group">
        <button type="button"><img src={antitoxicLogo} /> Antitoxic </button>
        <button type="button"><img src={artalaxiesWhiteLogo} /> Marketplace </button>
        <button type="button"><img src={communityLogo} /> Community </button>
      </div>
      <div className="gpt3__header-content__people">
        <img src={people} />
        <p>1,600 people requested access a visit in last 24 hours</p>
      </div>
    </div>
  </div>
);

export default Header;
