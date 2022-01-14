import React from 'react';
import Feature from '../../components/feature/Feature';
import './features.css';
import '../header/header.css';

const featuresData = [
  {
    title: 'NFT Artists',
    text: 'Secure your artworks by minting them and creating NFT derivitives that you can share with losing original ownership. ',
  },
  {
    title: 'Merchants',
    text: 'Get permission to use artwork by buying derivative tokens and printing graphics onto whatever products you want to make. ',
  },
  {
    title: 'Musicians',
    text: "Sometimes streaming music isn't enough, and when you want to work with a record label company you only earn 50% of the total revenue. Take back ownership by integrating blockchain into your music.",
  },
];

const Features = () => (
  <div className="features section__padding" id="features">
    <div className="features-heading">
      <h1 className="gradient__text">Artists. Merchants. NFT Enthusiasts.  The Future is Now. </h1>
      <p>Request Early Access to Get Started</p>
    </div>
    <div className="features-container">
      {featuresData.map((item, index) => (
        <Feature title={item.title} text={item.text} key={item.title + index} />
      ))}
    </div>
  </div>
);

export default Features;
