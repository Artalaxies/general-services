import React from 'react';
import { Outlet, BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Outlet, Link } from "react-router-dom";

import { Footer, Features, Focus, Header } from './containers';
import { CTA, Navbar } from './components';

import './App.css';

const Layout = (
  <div className="App">
    <div className="gradient__bg">
      <Navbar />
      <Header />
    </div>
    <Outlet />
  </div>
);

const Home = (
  <>
    {/* <Brand /> */}
    <Focus />
    <Features />
    {/* <Possibility /> */}
    <CTA />
    {/* <Blog /> */}
    <Footer />
  </>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={Layout}>
        <Route index element={Home} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
