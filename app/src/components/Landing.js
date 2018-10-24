import React from 'react';
import AuthButton from './AuthButton';
import './Landing.css';
import backgroundImage from '../assets/background.webp';


const Landing = () => (
  <div id="landing-page">
    <div className="content">
      <h1>Gain Insight into your <br /> Earning and Spending</h1>
      <AuthButton></AuthButton>
    </div>
    <div className="full-page-background">
      <img src={backgroundImage} />
    </div>
  </div>
);


export default Landing;
