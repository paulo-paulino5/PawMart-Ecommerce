import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:8080/api';
  private productsSignal = signal<Product[]>([]);
  private cartSignal = signal<Cart>({ items: [], total: 0 });

  constructor(private http: HttpClient) {
    this.loadProductsFromApi();
  }

  private mapBackendToFrontend(p: BackendProduct): Product {
    // Convert price to number if it's a string
    const priceNum = typeof p.price === 'number' ? p.price : parseFloat((p.price || '0').toString());
    
    // Ensure image path starts with /
    const imagePath = p.image || '/placeholder.png';
    const image = imagePath.startsWith('/') ? imagePath : '/' + imagePath;

    // Map category name to enum
    const catRaw = (p.categoryName || '').toLowerCase();
    let category: ProductCategory = ProductCategory.DOG;
    if (catRaw.includes('cat')) category = ProductCategory.CAT;
    else if (catRaw.includes('small')) category = ProductCategory.SMALL_PETS;
    else if (catRaw.includes('fish')) category = ProductCategory.FISH;
    else if (catRaw.includes('reptile')) category = ProductCategory.REPTILE;
    else if (catRaw.includes('dog')) category = ProductCategory.DOG;

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

  private loadProductsFromApi(): void {
    this.http.get<BackendProduct[]>(`${this.apiUrl}/products`)
      .pipe(
        map(backendProducts => backendProducts.map(p => this.mapBackendToFrontend(p))),
        catchError(error => {
          console.error('Failed to load products from API, using fallback data:', error);
          // Fallback to hardcoded data if API fails
          return of(this.getFallbackProducts());
        })
      )
      .subscribe(products => {
        this.productsSignal.set(products);
      });
  }

  private getFallbackProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Premium Dog Food - Chicken & Rice',
        description: 'High-quality dry dog food made with real chicken and brown rice. Perfect for adult dogs.',
        price: 300,
        image: '/DogFood.jpg',
        category: ProductCategory.DOG,
        inStock: true,
        rating: 4.5
      },
      {
        id: 2,
        name: 'Adjustable Dog Leash',
        description: 'Durable 6-foot adjustable leash with comfortable grip handle. Available in multiple colors.',
        price: 250,
        image: '/leash.jpg',
        category: ProductCategory.DOG,
        inStock: true,
        rating: 4.2
      },
      {
        id: 3,
        name: 'Orthopedic Dog Bed',
        description: 'Memory foam dog bed with removable, washable cover. Great for senior dogs or those with joint issues.',
        price: 500,
        image: '/DogBed.png',
        category: ProductCategory.DOG,
        inStock: true,
        rating: 4.7
      },
      {
        id: 4,
        name: 'Interactive Dog Toy',
        description: 'Puzzle toy that dispenses treats to keep your dog mentally stimulated and entertained.',
        price: 150,
        image: '/DogToy.jpg',
        category: ProductCategory.DOG,
        inStock: true,
        rating: 4.3
      },
      {
        id: 5,
        name: 'Natural Cat Litter - Clumping',
        description: 'Eco-friendly clumping cat litter made from natural clay. Controls odors for up to 7 days.',
        price: 400,
        image: '/CatLitter.png',
        category: ProductCategory.CAT,
        inStock: true,
        rating: 4.4
      },
      {
        id: 6,
        name: 'Feather Wand Cat Toy',
        description: 'Interactive feather wand toy to stimulate your cat\'s natural hunting instincts.',
        price: 150,
        image: '/CatFeather.png',
        category: ProductCategory.CAT,
        inStock: true,
        rating: 4.6
      },
      {
        id: 7,
        name: 'Cat Scratching Post',
        description: 'Tall sisal scratching post with hanging toys. Helps maintain healthy claws.',
        price: 400,
        image: '/CatPost.png',
        category: ProductCategory.CAT,
        inStock: true,
        rating: 4.1
      },
      {
        id: 8,
        name: 'Premium Cat Food - Salmon',
        description: 'Grain-free wet cat food made with real salmon. Rich in omega-3 fatty acids.',
        price: 450,
        image: '/CatFood.png',
        category: ProductCategory.CAT,
        inStock: true,
        rating: 4.8
      },
      {
        id: 9,
        name: 'Hamster Habitat Kit',
        description: 'Complete habitat kit with wheel, water bottle, and food dish. Perfect for small pets.',
        price: 400,
        image: '/HamsterHouse.png',
        category: ProductCategory.SMALL_PETS,
        inStock: true,
        rating: 4.2
      },
      {
        id: 10,
        name: 'Small Pet Food Pellets',
        description: 'Nutritionally balanced pellets for rabbits, guinea pigs, and other small pets.',
        price: 200,
        image: '/HamsterFood.png',
        category: ProductCategory.SMALL_PETS,
        inStock: true,
        rating: 4.4
      }
    ];
  }

  getProducts(): Product[] {
    return this.productsSignal();
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.productsSignal().filter(product => product.category === category);
  }

  getProduct(id: number): Product | undefined {
    return this.productsSignal().find(product => product.id === id);
  }

  searchProducts(query: string): Product[] {
    const searchTerm = query.toLowerCase();
    return this.productsSignal().filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  getCart() {
    return this.cartSignal();
  }

  getCartSignal() {
    return this.cartSignal.asReadonly();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSignal();
    const existingItem = currentCart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.items.push({ product, quantity });
    }

    this.updateCartTotal();
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSignal();
    currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCartTotal();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSignal();
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

  clearCart(): void {
    this.cartSignal.set({ items: [], total: 0 });
  }

  private updateCartTotal(): void {
    const currentCart = this.cartSignal();
    const total = currentCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    this.cartSignal.set({
      ...currentCart,
      total: Math.round(total * 100) / 100 // Round to 2 decimal places
    });
  }

  getCartItemCount(): number {
    return this.cartSignal().items.reduce((count, item) => count + item.quantity, 0);
  }
}