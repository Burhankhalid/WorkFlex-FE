import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Dashboard</span>
      <span class="spacer"></span>
      <span *ngIf="authService.currentUser() as user">
        Welcome, {{ user.firstName }} {{ user.lastName }}
      </span>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    
    <div class="dashboard-content">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to the Dashboard</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>You have successfully logged in!</p>
          <p *ngIf="authService.currentUser() as user">
            <strong>User ID:</strong> {{ user.id }}<br>
            <strong>Username:</strong> {{ user.username }}<br>
            <strong>Email:</strong> {{ user.email }}
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    .dashboard-content {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    mat-card {
      margin-bottom: 20px;
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  
  logout(): void {
    this.authService.logout();
  }
}