import React from 'react';

// 引入所有區塊元件
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import IPInfo from './components/IPInfo';
import SecurityNews from './components/SecurityNews';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // 注意: React 中 "class" 必須寫成 "className"
  return (
    <div className="container">
      <Header />
      <Hero />
      <Projects />
      <About />
      <IPInfo />
      <SecurityNews />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;