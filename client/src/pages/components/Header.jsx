import React from 'react';
import { NavLink, Link } from "react-router-dom";
import '../Home.css'; // Make sure the path correctly points to your CSS

function Header({ activePage }) {
    const NAV_LINKS = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Promise", path: "/promise" },
    { name: "Changelog", path: "/changelog" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <div className="navbar-logo-icon">▦</div>
          <span className="navbar-logo-text">Study Room</span>
        </NavLink>
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                // 'end' prevents the "/" home path from matching "/pricing", "/promise", etc.
                end={link.path === "/"} 
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.name}
              </NavLink>
            ))}
        </div>
        <div className="navbar-actions">
          <Link to="/login" className="btn-outline sm">
            Log in
          </Link>
          <Link to="/signup" className="btn-primary sm">
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;