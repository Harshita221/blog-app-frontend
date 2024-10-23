import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer>
      <ul className="footer_catergories">
        <li><Link to="/posts/categories/Food">Food</Link></li>
        <li><Link to="/posts/categories/Agriculture">Agriculture</Link></li>
        <li><Link to="/posts/categories/Education">Education</Link></li>
        <li><Link to="/posts/categories/Investment">Investment</Link></li>
        <li><Link to="/posts/categories/Travel">Travel</Link></li>
      </ul>
      <div className="footer_copyright">
        <small>All Rights Reserved &copy; Copyright, Harshita Badwal.</small>
      </div>
    </footer>
  );
};

export default Footer;
