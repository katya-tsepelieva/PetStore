import React from 'react';
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© {new Date().getFullYear()} PetShop. Всі права захищені.</p>
      </div>
    </footer>
  );
};

export default Footer;