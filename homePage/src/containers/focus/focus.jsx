import React from 'react';
import Feature from '../../components/feature/Feature';
import './focus.css';
import antitoxicLogo from '../../assets/antitoxic_logo.png';
import artalaxiesWhiteLogo from '../../assets/artalaxies_white.png';
import communityLogo from '../../assets/community.png';

const Focus = () => (
  <div className="focus section__margin" id="focus">
    <div className="focus-feature">
      <Feature title="What we focus on?" text="Artaliaxies is using the Web 3 to build decentralized application for the next generation of internet experience. Use our platforms to secure and mint your artwork and products with blockchain technology." />
    </div>
    <div className="focus-heading">
      <h1 className="gradient__text">The possibilities are beyond your imagination</h1>
      {/* <p>Explore the Library</p> */}
    </div>
    <div className="focus-container">
      <Feature img={antitoxicLogo} title="Music" text="Antitoxics is a decentralized music player that is able to integrate with consistent gross profit pattern to creators. " />
      <Feature img={artalaxiesWhiteLogo} title="Maketplace" text="Artalaxies is a decentralized marketplace that focuses on providing anonomyous art designers a platform to produce and protect their NFT derivatives." />
      <Feature img={communityLogo} title="Community" text="Join our community so communicate with others on how they were successful on the platform. You can also provide feedback to the developers and designers and contribute to future changes." />
    </div>
  </div>
);

export default Focus;
