import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="contact-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1>Contact Us</h1>
          <p class="hero-subtitle">We'd love to hear from you! Get in touch with our friendly team.</p>
          <div class="hero-image">📞</div>
        </div>
      </div>

      <div class="content-section">
        <div class="container">
          <!-- Contact Info -->
          <section class="contact-info-section">
            <h2>Get In Touch</h2>
            <div class="contact-grid">
              <div class="contact-card">
                <div class="contact-icon">📍</div>
                <h3>Visit Our Store</h3>
                <p>
                  123 Pet Street, Quezon City<br>
                  Metro Manila, Philippines 1100
                </p>
                <p class="hours">
                  <strong>Store Hours:</strong><br>
                  Mon-Sat: 9:00 AM - 8:00 PM<br>
                  Sunday: 10:00 AM - 6:00 PM
                </p>
              </div>

              <div class="contact-card">
                <div class="contact-icon">📞</div>
                <h3>Call Us</h3>
                <p>
                  <strong>Main Line:</strong> (02) 8123-4567<br>
                  <strong>Mobile:</strong> +63 917 123 4567<br>
                  <strong>Toll Free:</strong> 1800-PAWMART
                </p>
                <p class="hours">
                  <strong>Support Hours:</strong><br>
                  Mon-Fri: 8:00 AM - 10:00 PM<br>
                  Weekends: 9:00 AM - 7:00 PM
                </p>
              </div>

              <div class="contact-card">
                <div class="contact-icon">✉️</div>
                <h3>Email Us</h3>
                <p>
                  <strong>General:</strong> hello@pawmart.ph<br>
                  <strong>Support:</strong> support@pawmart.ph<br>
                  <strong>Orders:</strong> orders@pawmart.ph
                </p>
                <p class="response-time">
                  We typically respond within 24 hours
                </p>
              </div>

              <div class="contact-card">
                <div class="contact-icon">💬</div>
                <h3>Social Media</h3>
                <p>
                  <strong>Facebook:</strong> @PawMartPH<br>
                  <strong>Instagram:</strong> @pawmart_ph<br>
                  <strong>Twitter:</strong> @PawMartPH
                </p>
                <p class="response-time">
                  Follow us for updates and pet tips!
                </p>
              </div>
            </div>
          </section>


        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      min-height: 100vh;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-image {
      font-size: 4rem;
      margin-top: 2rem;
    }

    /* Content */
    .content-section {
      padding: 4rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    section {
      margin-bottom: 4rem;
    }

    h2 {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 3rem;
      color: #333;
      font-weight: 600;
    }

    /* Contact Info Grid */
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .contact-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .contact-card:hover {
      transform: translateY(-5px);
    }

    .contact-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .contact-card h3 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .contact-card p {
      color: #666;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .hours, .response-time {
      font-size: 0.9rem;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  constructor() {}
}