import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="card intro">
        <h2>嗨，我是楊立宇(鱷魚) </h2>
        <p>我是一位對演算法與系統安全感興趣的學生。熱衷於學習各種新技術。</p>

        <div className="section-title" style={{ marginTop: '18px' }}>
          <h3>技能</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="pill">cybersercurirty</span>
          <span className="pill">C / C++</span>
          <span className="pill">Python</span>
        </div>
      </div>

      <aside className="card profile">
        <img className="avatar" src="/profile_pic.png" alt="我的大頭貼" />
        <div style={{ fontWeight: 700 }}>楊立宇</div>
        <div className="meta">Taiwan• Taipei • NTNU</div>
        <div className="links" style={{ marginTop: '8px' }}>
          <a href="https://github.com/leo5358">GitHub</a>
          <a href="https://www.linkedin.com/in/yang-liyu/">LinkedIn</a>
          <a href="https://leetcode.com/u/Leo_from_tw_237/">Leetcode</a>
          <a href="https://play.picoctf.org/users/Leo_c137">picoCTF</a>
        </div>
      </aside>
    </section>
  );
}

export default Hero;