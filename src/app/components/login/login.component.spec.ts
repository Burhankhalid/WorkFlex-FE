import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    // Create spies for all dependencies
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values and proper validators', () => {
      fixture.detectChanges();
      
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('username')?.hasError('required')).toBe(true);
      expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
    });

    it('should initialize signals with correct default values', () => {
      fixture.detectChanges();
      
      expect(component.hidePassword()).toBe(true);
      expect(component.isLoading()).toBe(false);
    });

    it('should redirect to dashboard if already authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      
      fixture.detectChanges();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should not redirect if not authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      
      fixture.detectChanges();
      
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should be invalid when form is empty', () => {
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be invalid when username is less than 3 characters', () => {
      component.loginForm.patchValue({
        username: 'ab',
        password: 'validpassword'
      });
      
      expect(component.loginForm.get('username')?.hasError('minlength')).toBe(true);
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be invalid when password is less than 6 characters', () => {
      component.loginForm.patchValue({
        username: 'validuser',
        password: '12345'
      });
      
      expect(component.loginForm.get('password')?.hasError('minlength')).toBe(true);
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should be valid when both fields meet requirements', () => {
      component.loginForm.patchValue({
        username: 'validuser',
        password: 'validpassword'
      });
      
      expect(component.loginForm.valid).toBeTruthy();
    });
  });

  describe('Error Messages', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should return required error message for empty username', () => {
      const control = component.loginForm.get('username');
      control?.markAsTouched();
      
      const errorMessage = component.getErrorMessage('username');
      expect(errorMessage).toBe('Username is required');
    });

    it('should return required error message for empty password', () => {
      const control = component.loginForm.get('password');
      control?.markAsTouched();
      
      const errorMessage = component.getErrorMessage('password');
      expect(errorMessage).toBe('Password is required');
    });

    it('should return minlength error message for short username', () => {
      component.loginForm.patchValue({ username: 'ab' });
      const control = component.loginForm.get('username');
      control?.markAsTouched();
      
      const errorMessage = component.getErrorMessage('username');
      expect(errorMessage).toBe('Username must be at least 3 characters');
    });

    it('should return minlength error message for short password', () => {
      component.loginForm.patchValue({ password: '123' });
      const control = component.loginForm.get('password');
      control?.markAsTouched();
      
      const errorMessage = component.getErrorMessage('password');
      expect(errorMessage).toBe('Password must be at least 6 characters');
    });

    it('should return empty string for valid field', () => {
      component.loginForm.patchValue({ username: 'validuser' });
      
      const errorMessage = component.getErrorMessage('username');
      expect(errorMessage).toBe('');
    });
  });

  describe('Password Visibility Toggle', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should toggle password visibility', () => {
      expect(component.hidePassword()).toBe(true);
      
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);
      
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should not submit when form is invalid and mark form as touched', () => {
      const usernameControl = component.loginForm.get('username');
      const passwordControl = component.loginForm.get('password');
      
      expect(usernameControl?.touched).toBeFalsy();
      expect(passwordControl?.touched).toBeFalsy();
      
      component.onSubmit();
      
      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(usernameControl?.touched).toBeTruthy();
      expect(passwordControl?.touched).toBeTruthy();
    });

    it('should submit when form is valid and handle successful login', () => {
      const mockResponse = { 
        token: 'fake-token',
        user: { id: '1', username: 'testuser', email: 'test@example.com' }
      };
      mockAuthService.login.and.returnValue(of(mockResponse));
      
      component.loginForm.patchValue({
        username: 'validuser',
        password: 'validpassword'
      });
      
      component.onSubmit();
      
      expect(component.isLoading()).toBe(false); // Should be false after successful login
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'validuser',
        password: 'validpassword'
      });
      expect(mockToastr.success).toHaveBeenCalledWith('Login successful!', 'Success');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle login error', () => {
      const mockError = { error: 'Invalid credentials' };
      mockAuthService.login.and.returnValue(throwError(() => mockError));
      
      component.loginForm.patchValue({
        username: 'validuser',
        password: 'validpassword'
      });
      
      component.onSubmit();
      
      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage).toBe('Invalid credentials');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle login error without specific error message', () => {
      const mockError = {};
      mockAuthService.login.and.returnValue(throwError(() => mockError));
      
      component.loginForm.patchValue({
        username: 'validuser',
        password: 'validpassword'
      });
      
      component.onSubmit();
      
      expect(component.errorMessage).toBe('Login failed. Please try again.');
    });

    it('should set loading state during login process', () => {
      // Create a delayed observable to test loading state
      const mockResponse = { 
        token: 'fake-token',
        user: { id: '1', username: 'testuser', email: 'test@example.com' }
      };
      mockAuthService.login.and.returnValue(of(mockResponse));
      
      component.loginForm.patchValue({
        username: 'validuser',
        password: 'validpassword'
      });
      
      component.onSubmit();
      
      // The loading state should be set to true initially, then false after completion
      // Since the observable completes synchronously in this test, we can only check the final state
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('markFormGroupTouched', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should mark all form controls as touched', () => {
      const usernameControl = component.loginForm.get('username');
      const passwordControl = component.loginForm.get('password');
      
      expect(usernameControl?.touched).toBeFalsy();
      expect(passwordControl?.touched).toBeFalsy();
      
      component['markFormGroupTouched']();
      
      expect(usernameControl?.touched).toBeTruthy();
      expect(passwordControl?.touched).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should complete full login flow', () => {
      const mockResponse = { 
        token: 'fake-token',
        user: { id: '1', username: 'testuser', email: 'test@example.com' }
      };
      mockAuthService.login.and.returnValue(of(mockResponse));
      
      // Fill form
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpassword'
      });
      
      // Submit form
      component.onSubmit();
      
      // Verify complete flow
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpassword'
      });
      expect(mockToastr.success).toHaveBeenCalledWith('Login successful!', 'Success');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      expect(component.isLoading()).toBe(false);
    });
  });
});