import React from "react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";


function Footer(){
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h1 className="footer-logo">NoiseMaker</h1>
          <p className="footer-tagline">
            A legjobb minőségű hangszerek széles választékát találhatod meg itt.
            NoiseMaker, ahol a minőség számít.
          </p>
        </div>

        <div className="footer-links">
          <h4 className="footer-title">Navigáció</h4>
          <a href="/fooldal" className="footer-link">Főoldal</a>
     
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Elérhetőségeink</h4>
          <div className="footer-icons">
            <a href="https://www.instagram.com/molnii.beats/?next=%2F" className="footer-icon">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/dszcbarossgabor" className="footer-icon">
              <FaFacebookF />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 NoiseMaker
      </div>
    </footer>
  );
}

export default Footer;