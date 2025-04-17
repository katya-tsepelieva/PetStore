import React, { useEffect } from "react";
import "../styles/contact.css";

const Contact = () => {

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Контакти</h1>
        <div className="contact-details">
          <div className="contact-form">
            <h2>Залиште повідомлення</h2>
            <form>
              <div>
                <label htmlFor="name">Ім'я:</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div>
                <label htmlFor="email">Електронна пошта:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div>
                <label htmlFor="message">Повідомлення:</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit">Відправити</button>
            </form>
          </div>

          <div className="contact-info">
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
