import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Product, ProductCategory } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-page">
      <div class="container">
        <h1>Our Pet Products</h1>
        
        <!-- Filters -->
        <div class="filters">
          <div class="search-bar">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="onSearch()"
              placeholder="Search products..." 
              class="search-input"
            />
          </div>
          
          <div class="category-filters">
            <button 
              class="filter-btn"
              [class.active]="selectedCategory() === null"
              (click)="filterByCategory(null)"
            >
              All Products
            </button>
            <button 
              class="filter-btn"
              [class.active]="selectedCategory() === 'dog'"
              (click)="filterByCategory('dog')"
            >
              🐕 Dogs
            </button>
            <button 
              class="filter-btn"
              [class.active]="selectedCategory() === 'cat'"
              (click)="filterByCategory('cat')"
            >
              🐱 Cats
            </button>
            <button 
              class="filter-btn"
              [class.active]="selectedCategory() === 'small-pets'"
              (click)="filterByCategory('small-pets')"
            >
              🐹 Small Pets
            </button>
          </div>

          <div class="sort-options">
            <label for="sort">Sort by:</label>
            <select id="sort" [(ngModel)]="sortBy" (change)="onSort()" class="sort-select">
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          @for (product of displayedProducts(); track product.id) {
            <div class="product-card">
              <div class="product-image">
                <img [src]="product.image" [alt]="product.name" />
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <div class="product-price">₱{{ product.price }}</div>
                <button 
                  class="add-to-cart-btn" 
                  (click)="addToCart(product)"
                  [disabled]="!product.inStock"
                >
                  {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
                </button>
              </div>
            </div>
          }
        </div>

        @if (displayedProducts().length === 0) {
          <div class="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      padding: 2rem 0;
      min-height: 100vh;
      background: transparent;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    h1 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: #333;
    }

    /* Filters */
    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 15px;
      margin-bottom: 2rem;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .search-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 0.8rem 1rem;
      border: 2px solid #e1e8ed;
      border-radius: 25px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-hint {
      font-size: 0.85rem;
      color: #667eea;
      font-style: italic;
    }

    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .filter-btn {
      background: #f8f9fa;
      border: 2px solid #e1e8ed;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .filter-btn:hover {
      background: #e9ecef;
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #667eea;
    }

    .sort-options {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .sort-select {
      padding: 0.5rem;
      border: 2px solid #e1e8ed;
      border-radius: 8px;
      font-size: 1rem;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }

    .product-image {
      width: 100%;
      height: 200px;
      margin-bottom: 1rem;
      overflow: hidden;
      border-radius: 10px;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-info h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .product-description {
      color: #666;
      line-height: 1.5;
      margin-bottom: 1rem;
      flex: 1;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stars {
      color: #ffc107;
      font-size: 1rem;
    }

    .rating-text {
      font-size: 0.9rem;
      color: #666;
    }

    .product-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .add-to-cart-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.8rem 1rem;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      width: 100%;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .add-to-cart-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .no-products {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.2rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .filters {
        padding: 1rem;
      }

      .category-filters {
        justify-content: flex-start;
      }

      .filter-btn {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  displayedProducts = signal<Product[]>([]);
  selectedCategory = signal<string | null>(null);
  searchQuery = '';
  sortBy = 'name';

  // RxJS: Debounced search implementation
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.displayedProducts.set(this.products);
    
    // RxJS: Setup debounced search
    // Waits 300ms after user stops typing before applying filter
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),           // Wait 300ms after last keystroke
      distinctUntilChanged()       // Only if search value changed
    ).subscribe(searchQuery => {
      this.searchQuery = searchQuery;
      this.applyFilters();
    });
    
    // Check for category parameter in URL
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filterByCategory(params['category']);
      }
    });
  }

  ngOnDestroy() {
    // RxJS: Clean up subscription to prevent memory leaks
    this.searchSubscription?.unsubscribe();
  }

  filterByCategory(category: string | null) {
    this.selectedCategory.set(category);
    this.applyFilters();
  }

  onSearch() {
    // RxJS: Emit search query to debounced stream
    // Instead of immediate filtering, wait for user to stop typing
    this.searchSubject.next(this.searchQuery);
  }

  onSort() {
    const sorted = [...this.displayedProducts()];
    
    switch (this.sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    this.displayedProducts.set(sorted);
  }

  private applyFilters() {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory()) {
      filtered = filtered.filter(product => product.category === this.selectedCategory());
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    this.displayedProducts.set(filtered);
    this.onSort(); // Apply current sort
  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
    // You could add a toast notification here
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    const emptyStars = 5 - Math.ceil(rating);
    stars += '☆'.repeat(emptyStars);
    return stars;
  }
}