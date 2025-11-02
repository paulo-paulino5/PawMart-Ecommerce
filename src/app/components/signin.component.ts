import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthCredentials } from '../models/user.model';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <h1>Sign In</h1>
          <p class="auth-subtitle">Welcome back! Please sign in to your account.</p>
          
          <form (ngSubmit)="onSignIn()" #signInForm="ngForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="credentials.email"
                #email="ngModel"
                required
                email
                class="form-input"
                placeholder="Enter your email"
              />
              <div class="error-message" *ngIf="email.invalid && email.touched">
                <span *ngIf="email.errors?.['required']">Email is required</span>
                <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="credentials.password"
                #password="ngModel"
                required
                minlength="6"
                class="form-input"
                placeholder="Enter your password"
              />
              <div class="error-message" *ngIf="password.invalid && password.touched">
                <span *ngIf="password.errors?.['required']">Password is required</span>
                <span *ngIf="password.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="submit-btn"
                [disabled]="signInForm.invalid || isLoading()"
              >
                <span *ngIf="!isLoading()">Sign In</span>
                <span *ngIf="isLoading()">Signing In...</span>
              </button>
            </div>

            <div class="auth-message" *ngIf="message()">
              <p [class.error]="!isSuccess()" [class.success]="isSuccess()">
                {{ message() }}
              </p>
            </div>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/sign-up">Sign up here</a></p>
            <p><a routerLink="/">Back to Home</a></p>
          </div>
        </div>

        <!-- Demo Credentials -->
        <div class="demo-info">
          <h3>Demo Account</h3>
          <p>Email: <strong>john.doe@example.com</strong></p>
          <p>Password: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .auth-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      max-width: 400px;
    }

    .auth-card {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .auth-card h1 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .auth-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    .form-input {
      padding: 1rem;
      border: 2px solid #e1e8ed;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-message {
      margin-top: 1rem;
    }

    .auth-message .error {
      color: #e74c3c;
    }

    .auth-message .success {
      color: #27ae60;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
    }

    .auth-footer p {
      margin-bottom: 0.5rem;
      color: #666;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .demo-info {
      background: rgba(255, 255, 255, 0.2);
      padding: 1.5rem;
      border-radius: 15px;
      color: white;
      text-align: center;
      backdrop-filter: blur(10px);
    }

    .demo-info h3 {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .demo-info p {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .demo-info strong {
      color: #fff;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .auth-page {
        padding: 1rem;
      }

      .auth-card {
        padding: 2rem;
      }

      .auth-card h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class SignInComponent {
  credentials: AuthCredentials = {
    email: '',
    password: ''
  };

  private isLoadingSignal = signal(false);
  private messageSignal = signal('');
  private isSuccessSignal = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoading = this.isLoadingSignal.asReadonly();
  message = this.messageSignal.asReadonly();
  isSuccess = this.isSuccessSignal.asReadonly();

  async onSignIn() {
    this.isLoadingSignal.set(true);
    this.messageSignal.set('');

    try {
      const result = await this.authService.signIn(this.credentials);
      
      if (result.success) {
        this.isSuccessSignal.set(true);
        this.messageSignal.set(result.message || 'Successfully signed in!');
        
        // Redirect to home page after successful sign in
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      } else {
        this.isSuccessSignal.set(false);
        this.messageSignal.set(result.message || 'Sign in failed. Please try again.');
      }
    } catch (error) {
      this.isSuccessSignal.set(false);
      this.messageSignal.set('An error occurred. Please try again.');
    } finally {
      this.isLoadingSignal.set(false);
    }
  }
}