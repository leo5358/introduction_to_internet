import React from 'react';

function Contact() {
  return (
    <section id="contact" className="card" style={{ marginTop: '18px' }}>
      <div className="section-title"><h3>聯絡我</h3></div>
      <div className="grid">
        <div>
          <p className="meta">Email</p>
          <p>leo1yang5358@gmail.com</p>
          <p className="meta" style={{ marginTop: '12px' }}>社群</p>
          <p><a href="https://github.com/leo5358">GitHub</a> · <a href="https://www.linkedin.com/in/yang-liyu/">LinkedIn</a> </p>
        </div>
        <div>
          <form className="contact-form" action="https://formsubmit.co/leo1yang5358@gmail.com" method="POST">
            <input type="text" id="name" name="name" placeholder="Your name" required />
            <input type="email" id="email" name="email" placeholder="Your email" required style={{ marginTop: '8px' }}/>
            <textarea id="message" name="message" placeholder="Message" style={{ marginTop: '8px' }} required></textarea>
            <input type="hidden" name="_autoresponse" value="感謝您的來信，我會盡快回覆您！" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn btn-primary" type="submit">送出</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;