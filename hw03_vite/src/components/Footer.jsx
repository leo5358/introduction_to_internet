import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div>© <span id="year">{currentYear}</span> 楊立宇</div>
    </footer>
  );
}

export default Footer;