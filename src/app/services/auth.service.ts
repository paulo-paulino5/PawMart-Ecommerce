import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, AuthCredentials, RegisterData, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isLoggedInSignal = signal<boolean>(false);
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    // Check for existing session on initialization
    this.loadStoredUser();
  }

  getCurrentUser() {
    return this.currentUserSignal.asReadonly();
  }

  isLoggedIn() {
    return this.isLoggedInSignal.asReadonly();
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/login`, credentials)
      );

      if (response.success && response.user) {
        // Map backend user data to frontend User model
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          phone: response.user.phone || '',
          dateJoined: new Date() // You can get this from backend if needed
        };

        this.setUser(user);
        return {
          success: true,
          user: user,
          message: response.message || 'Successfully signed in!'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Invalid email or password.'
        };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          return {
            success: false,
            message: 'Invalid email or password.'
          };
        } else if (error.status === 0) {
          return {
            success: false,
            message: 'Unable to connect to server. Please try again later.'
          };
        }
      }
      
      return {
        success: false,
        message: 'An error occurred during sign in. Please try again.'
      };
    }
  }

  async signUp(registerData: RegisterData): Promise<AuthResponse> {
    try {
      // Map frontend RegisterData to backend Customer format
      const customerData = {
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        dateOfBirth: null, // Can be added to form later
        gender: null // Can be added to form later
      };

      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/register`, customerData)
      );

      if (response.success && response.user) {
        // Map backend user data to frontend User model
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          phone: response.user.phone || '',
          dateJoined: new Date()
        };

        this.setUser(user);
        return {
          success: true,
          user: user,
          message: response.message || 'Account created successfully!'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed.'
        };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          return {
            success: false,
            message: 'Email already exists or invalid data provided.'
          };
        } else if (error.status === 0) {
          return {
            success: false,
            message: 'Unable to connect to server. Please try again later.'
          };
        }
      }
      
      return {
        success: false,
        message: 'An error occurred during registration. Please try again.'
      };
    }
  }

  signOut(): void {
    this.currentUserSignal.set(null);
    this.isLoggedInSignal.set(false);
    
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }

  private setUser(user: User): void {
    this.currentUserSignal.set(user);
    this.isLoggedInSignal.set(true);
    
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  private loadStoredUser(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSignal.set(user);
          this.isLoggedInSignal.set(true);
        } catch (error) {
          // Invalid stored user data, remove it
          localStorage.removeItem('currentUser');
        }
      }
    }
  }
}