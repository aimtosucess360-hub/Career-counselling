import React from 'react';
import { Link } from 'react-router-dom';

const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb7eB5vJ3jupL4y6fE13';
const YOUTUBE_URL  = 'https://www.youtube.com/@Aim360-e3f';

const Footer = () => (
  <footer className="footer-custom">
    <div className="container">
      <div className="row g-4">

        {/* Brand */}
        <div className="col-lg-4">
          <h4 className="text-white fw-800 mb-1">
            <i className="bi bi-mortarboard-fill me-2 text-warning"></i>
            AIM <span className="text-warning">360</span>
          </h4>
          <p className="text-white-50 mb-3" style={{ fontSize: '0.82rem' }}>Career Counselling Platform</p>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
            Free career counselling for Engineering, Pharmacy, Diploma and ITI college admissions after 10th &amp; 12th standard.
          </p>
          <div className="d-flex gap-3 mt-3">
            <a href={YOUTUBE_URL}  target="_blank" rel="noopener noreferrer" className="text-white-50" title="YouTube">
              <i className="bi bi-youtube fs-4"></i>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-white-50" title="WhatsApp Channel">
              <i className="bi bi-whatsapp fs-4"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-6 col-lg-2">
          <h5>Quick Links</h5>
          <Link to="/">Home</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/youtube">Videos</Link>
          <Link to="/join-counselling">Join Counselling</Link>
          <Link to="/register">Register</Link>
        </div>

        {/* Services */}
        <div className="col-6 col-lg-3">
          <h5>Our Services</h5>
          <Link to="/join-counselling">Engineering Colleges</Link>
          <Link to="/join-counselling">Pharmacy Colleges</Link>
          <Link to="/join-counselling">Diploma / Polytechnic</Link>
          <Link to="/join-counselling">ITI Colleges</Link>
          <Link to="/join-counselling">After 10th Guidance</Link>
        </div>

        {/* Contact */}
        <div className="col-lg-3">
          <h5>Contact Us</h5>
          <p style={{ fontSize: '0.88rem' }}>
            <i className="bi bi-envelope me-2 text-warning"></i>support@aim360.in
          </p>
          <p style={{ fontSize: '0.88rem' }}>
            <i className="bi bi-telephone me-2 text-warning"></i>+91 98765 43210
          </p>
          <p style={{ fontSize: '0.88rem' }}>
            <i className="bi bi-geo-alt me-2 text-warning"></i>Maharashtra, India
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="btn btn-sm fw-700 mt-1 d-inline-flex align-items-center gap-2"
            style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 8, padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
            <i className="bi bi-whatsapp"></i> WhatsApp Channel
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="mb-0" style={{ fontSize: '0.83rem' }}>
          © {new Date().getFullYear()} AIM 360 — Career Counselling. All rights reserved.
          Made with <i className="bi bi-heart-fill text-danger"></i> for Indian Students.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
