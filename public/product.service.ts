import { Injectable, signal } from '@angular/core';
import { Product, ProductCategory, Cart, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    // Dog Products
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

    // Cat Products
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

    // Small Pets
    {
      id: 9,
      name: 'Hamster Habitat Kit',
      description: 'Complete habitat kit with wheel, water bottle, and food dish. Perfect for small pets.',
      price: 400,
      image: '🏠',
      category: ProductCategory.SMALL_PETS,
      inStock: true,
      rating: 4.2
    },
    {
      id: 10,
      name: 'Small Pet Food Pellets',
      description: 'Nutritionally balanced pellets for rabbits, guinea pigs, and other small pets.',
      price: 200,
      image: '🥕',
      category: ProductCategory.SMALL_PETS,
      inStock: true,
      rating: 4.4
    }
  ];

  private cartSignal = signal<Cart>({ items: [], total: 0 });

  getProducts(): Product[] {
    return this.products;
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.products.filter(product => product.category === category);
  }

  getProduct(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  searchProducts(query: string): Product[] {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
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