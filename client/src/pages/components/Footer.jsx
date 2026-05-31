import React from "react";
import '../Home.css';

function Footer() {
    return (
              <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-logo">
              <div className="footer-brand-icon">▦</div>
              <span className="footer-brand-name">Study Room</span>
            </div>
            <p className="footer-brand-desc">
              One tab for studying together and shipping placements. Free for students forever.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot" />
              All systems operational
            </div>
          </div>
          <div>
            <div className="footer-col-label">PRODUCT</div>
            {["Study rooms","Coding ground","Mock interviews","Pricing"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <div className="footer-col-label">RESOURCES</div>
            {["30-day Placement Sprint","FAANG Prep plan","Promise","Changelog"].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Study Room · Built by Jainth A in Chennai</span>
          <span className="footer-made">Made with 🍕 and <em>way too many Pomodoros</em></span>
        </div>
      </footer>
    );
}

export default Footer;