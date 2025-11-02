import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1>About PawMart</h1>
          <p class="hero-subtitle">Your trusted partner in pet care since 2020</p>
          <div class="hero-image">🐾</div>
        </div>
      </div>

      <div class="content-section">
        <div class="container">
          <!-- Our Story -->
          <section class="story-section">
            <h2>Our Story</h2>
            <div class="story-content">
              <div class="story-text">
                <p>
                  PawMart was founded with a simple mission: to provide pet owners with high-quality, 
                  affordable pet supplies that keep their furry, feathered, and scaled friends happy and healthy.
                </p>
                <p>
                  What started as a small local pet store has grown into a comprehensive online platform 
                  serving pet parents across the Philippines. We understand that pets are family, and we're 
                  committed to helping you give them the best care possible.
                </p>
              </div>
              <div class="story-image">
                <div class="placeholder-img">🏪</div>
              </div>
            </div>
          </section>

          <!-- Our Mission -->
          <section class="mission-section">
            <h2>Our Mission</h2>
            <div class="mission-grid">
              <div class="mission-card">
                <div class="mission-icon">🎯</div>
                <h3>Quality First</h3>
                <p>We carefully curate our products to ensure only the best for your pets.</p>
              </div>
              <div class="mission-card">
                <div class="mission-icon">💝</div>
                <h3>Affordability</h3>
                <p>Quality pet care shouldn't break the bank. We offer competitive prices without compromising quality.</p>
              </div>
              <div class="mission-card">
                <div class="mission-icon">🚚</div>
                <h3>Convenience</h3>
                <p>Fast, reliable delivery right to your doorstep. Because your pets can't wait.</p>
              </div>
              <div class="mission-card">
                <div class="mission-icon">❤️</div>
                <h3>Pet Love</h3>
                <p>Every decision we make is guided by our love for animals and commitment to their wellbeing.</p>
              </div>
            </div>
          </section>

          <!-- What We Offer -->
          <section class="offerings-section">
            <h2>What We Offer</h2>
            <div class="offerings-grid">
              <div class="offering-item">
                <span class="offering-icon">🐕</span>
                <h4>Dog Supplies</h4>
                <p>Premium food, toys, grooming supplies, and accessories for dogs of all sizes.</p>
              </div>
              <div class="offering-item">
                <span class="offering-icon">🐱</span>
                <h4>Cat Essentials</h4>
                <p>Everything your feline friend needs - from litter to gourmet treats.</p>
              </div>
              <div class="offering-item">
                <span class="offering-icon">🐦</span>
                <h4>Small Pet Care</h4>
                <p>Specialized products for birds, rabbits, hamsters, and other small pets.</p>
              </div>
              <div class="offering-item">
                <span class="offering-icon">🐠</span>
                <h4>Aquatic Life</h4>
                <p>Complete aquarium setups, fish food, and maintenance supplies.</p>
              </div>
              <div class="offering-item">
                <span class="offering-icon">🦎</span>
                <h4>Reptile Supplies</h4>
                <p>Terrariums, heating, lighting, and specialized nutrition for reptiles.</p>
              </div>
              <div class="offering-item">
                <span class="offering-icon">🏥</span>
                <h4>Health & Wellness</h4>
                <p>Vitamins, supplements, and health monitoring tools for all pets.</p>
              </div>
            </div>
          </section>

          <!-- Our Values -->
          <section class="values-section">
            <h2>Our Values</h2>
            <div class="values-content">
              <div class="value-item">
                <h4>🌱 Sustainability</h4>
                <p>We're committed to eco-friendly packaging and supporting sustainable pet product brands.</p>
              </div>
              <div class="value-item">
                <h4>🤝 Community</h4>
                <p>We actively support local animal shelters and pet rescue organizations.</p>
              </div>
              <div class="value-item">
                <h4>📚 Education</h4>
                <p>We provide resources and tips to help pet owners make informed decisions.</p>
              </div>
              <div class="value-item">
                <h4>🛡️ Trust</h4>
                <p>Transparent pricing, honest reviews, and reliable customer service you can count on.</p>
              </div>
            </div>
          </section>

          <!-- Call to Action -->
          <section class="cta-section">
            <div class="cta-content">
              <h2>Ready to Shop for Your Pet?</h2>
              <p>Discover thousands of products from trusted brands, all in one place.</p>
              <div class="cta-buttons">
                <a routerLink="/products" class="btn btn-primary">Browse Products</a>
                <a routerLink="/contact" class="btn btn-secondary">Contact Us</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
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

    /* Content Sections */
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

    /* Story Section */
    .story-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .story-text p {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      color: #555;
    }

    .placeholder-img {
      font-size: 8rem;
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 15px;
    }

    /* Mission Section */
    .mission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .mission-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .mission-card:hover {
      transform: translateY(-5px);
    }

    .mission-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .mission-card h3 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .mission-card p {
      color: #666;
      line-height: 1.5;
    }

    /* Offerings Section */
    .offerings-section {
      background: #f8f9fa;
      padding: 4rem 2rem;
      margin: 0 -2rem;
    }

    .offerings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .offering-item {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .offering-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .offering-item h4 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    .offering-item p {
      color: #666;
      line-height: 1.5;
      margin: 0;
    }

    /* Values Section */
    .values-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .value-item {
      text-align: center;
      padding: 1.5rem;
    }

    .value-item h4 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: #667eea;
    }

    .value-item p {
      color: #666;
      line-height: 1.5;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      margin: 4rem -2rem 0;
      text-align: center;
      border-radius: 15px 15px 0 0;
    }

    .cta-content h2 {
      color: white;
      margin-bottom: 1rem;
    }

    .cta-content p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-block;
      padding: 1rem 2rem;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      background: transparent;
      color: white;
      border-color: white;
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border-color: white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .story-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .mission-grid {
        grid-template-columns: 1fr;
      }

      .offerings-grid {
        grid-template-columns: 1fr;
      }

      .values-content {
        grid-template-columns: 1fr;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 200px;
      }
    }
  `]
})
export class AboutComponent {
  constructor() {}
}