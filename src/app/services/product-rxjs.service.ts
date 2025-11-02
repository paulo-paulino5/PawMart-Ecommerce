import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  Observable, 
  BehaviorSubject, 
  Subject,
  fromEvent,
  interval,
  of,
  merge
} from 'rxjs';
import { 
  map, 
  catchError, 
  debounceTime, 
  distinctUntilChanged,
  throttleTime,
  scan,
  filter,
  switchMap,
  tap,
  shareReplay
} from 'rxjs/operators';
import { Product, ProductCategory, Cart, CartItem } from '../models/product.model';

// Backend Product DTO interface
interface BackendProduct {
  id: number;
  name: string;
  description?: string;
  categoryName?: string;
  image?: string;
  unitOfMeasure?: string;
  price?: number;
  inStock?: boolean;
  rating?: number;
}

/**
 * ProductService with RxJS Patterns
 * 
 * This service demonstrates RxJS concepts:
 * - Observable: Streams of data over time
 * - Observer: Subscribers that react to data
 * - Operators: Transform and manipulate data streams
 * - Subject/BehaviorSubject: Multicast values to multiple observers
 * - Subscription: Manage observable execution
 */
@Injectable({
  providedIn: 'root'
})
export class ProductRxjsService {
  private readonly apiUrl = 'http://localhost:8080/api';

  // ============================================
  // RXJS CONCEPT: BehaviorSubject (type of Subject)
  // ============================================
  // BehaviorSubject is like an EventEmitter that stores the current value
  // Multiple components can subscribe and get the latest value immediately
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private cartSubject = new BehaviorSubject<Cart>({ items: [], total: 0 });
  
  // Search query subject for debounced search
  private searchQuerySubject = new Subject<string>();
  
  // Add to cart events subject (for tracking clicks)
  private addToCartSubject = new Subject<Product>();

  // ============================================
  // RXJS CONCEPT: Observable
  // ============================================
  // Public observables that components can subscribe to
  // These are read-only streams of data
  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  public cart$: Observable<Cart> = this.cartSubject.asObservable();
  
  // Derived observables using operators
  public cartItemCount$: Observable<number> = this.cart$.pipe(
    map(cart => cart.items.reduce((count, item) => count + item.quantity, 0))
  );

  public cartTotal$: Observable<number> = this.cart$.pipe(
    map(cart => cart.total)
  );

  // ============================================
  // RXJS CONCEPT: Operators (map, filter, debounceTime, etc.)
  // ============================================
  // Search observable with debouncing to prevent too many API calls
  public searchResults$: Observable<Product[]> = this.searchQuerySubject.pipe(
    debounceTime(300), // Wait 300ms after user stops typing
    distinctUntilChanged(), // Only emit when value actually changes
    switchMap(query => this.performSearch(query)), // Switch to new search, cancel previous
    shareReplay(1) // Cache last result for late subscribers
  );

  // ============================================
  // RXJS CONCEPT: Purity & Flow Control
  // ============================================
  // Track add to cart clicks with throttling (max 1 per second)
  public addToCartClicks$ = this.addToCartSubject.pipe(
    throttleTime(1000), // Allow at most 1 click per second
    scan((count) => count + 1, 0), // Accumulate count (pure function)
    tap(count => console.log(`Product added to cart ${count} times`))
  );

  constructor(private http: HttpClient) {
    this.loadProductsFromApi();
    this.initializeCartTracking();
  }

  // ============================================
  // Load products from API using Observable
  // ============================================
  private loadProductsFromApi(): void {
    this.http.get<BackendProduct[]>(`${this.apiUrl}/products`)
      .pipe(
        map(backendProducts => backendProducts.map(p => this.mapBackendToFrontend(p))),
        catchError(error => {
          console.error('Failed to load products from API:', error);
          return of(this.getFallbackProducts());
        }),
        tap(products => console.log(`Loaded ${products.length} products`))
      )
      .subscribe({
        next: (products) => this.productsSubject.next(products),
        error: (err) => console.error('Error loading products:', err)
      });
  }

  // ============================================
  // EXAMPLE: fromEvent - Convert DOM events to Observable
  // ============================================
  /**
   * Create an observable from document clicks
   * This demonstrates the fromEvent operator
   */
  public createClickObservable(): Observable<Event> {
    return fromEvent(document, 'click').pipe(
      throttleTime(1000), // Max 1 click per second
      tap(() => console.log('Document clicked!'))
    );
  }

  /**
   * Track cart changes over time
   * Demonstrates scan operator for state accumulation
   */
  public trackCartChanges(): Observable<number> {
    return this.cart$.pipe(
      scan((totalChanges) => totalChanges + 1, 0),
      tap(changes => console.log(`Cart has been modified ${changes} times`))
    );
  }

  // ============================================
  // Search functionality with debouncing
  // ============================================
  public search(query: string): void {
    this.searchQuerySubject.next(query);
  }

  private performSearch(query: string): Observable<Product[]> {
    if (!query || query.trim() === '') {
      return of(this.productsSubject.value);
    }

    const searchTerm = query.toLowerCase();
    const results = this.productsSubject.value.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );

    return of(results);
  }

  // ============================================
  // Get products by category (returns Observable)
  // ============================================
  public getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  // ============================================
  // Get single product (returns Observable)
  // ============================================
  public getProduct(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  // ============================================
  // Cart Operations
  // ============================================
  public addToCart(product: Product, quantity: number = 1): void {
    // Emit add to cart event for tracking
    this.addToCartSubject.next(product);

    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.items.push({ product, quantity });
    }

    this.updateCartTotal();
  }

  public removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCartTotal();
  }

  public updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCartTotal();
      }
    }
  }

  public clearCart(): void {
    this.cartSubject.next({ items: [], total: 0 });
  }

  private updateCartTotal(): void {
    const currentCart = this.cartSubject.value;
    const total = currentCart.items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );

    this.cartSubject.next({
      ...currentCart,
      total: Math.round(total * 100) / 100
    });
  }

  // ============================================
  // Initialize cart change tracking
  // ============================================
  private initializeCartTracking(): void {
    // Subscribe to cart changes and log them
    this.cart$.pipe(
      tap(cart => console.log('Cart updated:', cart))
    ).subscribe();

    // Track add to cart clicks
    this.addToCartClicks$.subscribe();
  }

  // ============================================
  // EXAMPLE: Polling for product updates
  // ============================================
  /**
   * Create an observable that polls for product updates every 30 seconds
   * Demonstrates interval operator
   */
  public startProductPolling(): Observable<Product[]> {
    return interval(30000).pipe( // Emit every 30 seconds
      switchMap(() => this.http.get<BackendProduct[]>(`${this.apiUrl}/products`)),
      map(backendProducts => backendProducts.map(p => this.mapBackendToFrontend(p))),
      tap(products => {
        console.log('Products refreshed from polling');
        this.productsSubject.next(products);
      }),
      catchError(error => {
        console.error('Polling error:', error);
        return of(this.productsSubject.value); // Return current products on error
      })
    );
  }

  // ============================================
  // EXAMPLE: Merge multiple observables
  // ============================================
  /**
   * Combine multiple product sources
   * Demonstrates merge operator
   */
  public getMergedProducts(): Observable<Product[]> {
    const apiProducts$ = this.http.get<BackendProduct[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.map(p => this.mapBackendToFrontend(p)))
    );

    const fallbackProducts$ = of(this.getFallbackProducts());

    // Merge both sources - emit whenever either emits
    return merge(apiProducts$, fallbackProducts$).pipe(
      catchError(() => fallbackProducts$)
    );
  }

  // ============================================
  // Helper methods
  // ============================================
  private mapBackendToFrontend(p: BackendProduct): Product {
    const priceNum = typeof p.price === 'number' ? p.price : parseFloat((p.price || '0').toString());
    const imagePath = p.image || '/placeholder.png';
    const image = imagePath.startsWith('/') ? imagePath : '/' + imagePath;

    const catRaw = (p.categoryName || '').toLowerCase();
    let category: ProductCategory = ProductCategory.DOG;
    if (catRaw.includes('cat')) category = ProductCategory.CAT;
    else if (catRaw.includes('small')) category = ProductCategory.SMALL_PETS;
    else if (catRaw.includes('fish')) category = ProductCategory.FISH;
    else if (catRaw.includes('reptile')) category = ProductCategory.REPTILE;

    return {
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: isNaN(priceNum) ? 0 : priceNum,
      image,
      category,
      inStock: p.inStock ?? true,
      rating: p.rating ?? 4.0
    };
  }

  private getFallbackProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Premium Dog Food - Chicken & Rice',
        description: 'High-quality dry dog food made with real chicken and brown rice.',
        price: 300,
        image: '/DogFood.jpg',
        category: ProductCategory.DOG,
        inStock: true,
        rating: 4.5
      },
      {
        id: 2,
        name: 'Adjustable Dog Leash',
        description: 'Durable 6-foot adjustable leash with comfortable grip handle.',
        price: 250,
        image: '/leash.jpg',
        category: ProductCategory.DOG,
        inStock: true,
        rating: 4.2
      }
    ];
  }
}
