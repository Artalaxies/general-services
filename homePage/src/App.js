import React from 'react';

import { Footer, Features, Focus, Header } from './containers';
import { CTA, Navbar } from './components';

import './App.css';

const App = () => (
  <div className="App">
    <div className="gradient__bg">
      <Navbar />
      <Header />
    </div>
    {/* <Brand /> */}
    <Focus />
    <Features />
    {/* <Possibility /> */}
    <CTA />
    {/* <Blog /> */}
    <Footer />
  </div>
);

export default App;
