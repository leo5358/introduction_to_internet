import React from 'react';

function Header() {
  return (
    <header>
      <div className="brand">
        <div>
          <h1>楊立宇</h1>
          <div className="pill">學生 • 演算法/資安愛好者</div>
        </div>
      </div>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export default Header;