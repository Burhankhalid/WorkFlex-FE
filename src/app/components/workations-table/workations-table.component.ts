import { Component, OnInit } from '@angular/core';
import { WorkationService } from '../../services/workation.service';
import { Workation } from '../../models/workation.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-workations-table',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './workations-table.component.html',
  styleUrl: './workations-table.component.scss'
})
export class WorkationsTableComponent implements OnInit {
  workations: Workation[] = [];
  sortedWorkations: Workation[] = [];
  loading: boolean = true;
  error: string | null = null;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private countryFlags: { [key: string]: string } = {
    'Germany': 'https://flagcdn.com/de.svg',
    'United States': 'https://flagcdn.com/us.svg', 
    'Ukraine': 'https://flagcdn.com/ua.svg',
    'Belgium': 'https://flagcdn.com/be.svg',
    'Spain': 'https://flagcdn.com/es.svg',
    'Greece': 'https://flagcdn.com/gr.svg',
    'India': 'https://flagcdn.com/in.svg'
  };

  // Map country names to codes for alt text
  private countryCodes: { [key: string]: string } = {
    'Germany': 'DE',
    'United States': 'US',
    'Ukraine': 'UA',
    'Belgium': 'BE',
    'Spain': 'ES',
    'Greece': 'GR',
    'India': 'IN'
  };

  constructor(private workationService: WorkationService) {}

  ngOnInit(): void {
    this.loadWorkations();
  }

  loadWorkations(): void {
    this.loading = true;
    this.workationService.getWorkations().subscribe({
      next: (data: any) => {
        this.workations = data;
        this.sortedWorkations = [...data];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load workations data';
        this.loading = false;
        console.error('Error loading workations:', err);
      }
    });
  }

  trackByWorkation(index: number, workation: Workation): any {
    // Use workationId as the unique identifier
    return workation.workationId;
  }

  getCountryFlag(countryName: string): string {
    return this.countryFlags[countryName] || '🏳️';
  }

  getCountryCode(countryName: string): string {
    return this.countryCodes[countryName] || countryName;
  }

  getRiskClass(riskLevel: string): string {
    switch (riskLevel) {
      case 'HIGH':
        return 'risk-high';
      case 'NO':
        return 'risk-no';
      case 'LOW':
        return 'risk-low';
      default:
        return 'risk-unknown';
    }
  }

  getRiskIcon(riskLevel: string): string {
    switch (riskLevel) {
      case 'HIGH':
        return './app-assets/images/red-risk.svg';
      case 'NO':
        return './app-assets/images/yellow-risk.svg';
      case 'LOW':
        return './app-assets/images/green-risk.svg';
      default:
        return './app-assets/images/yellow-risk.svg';
    }
  }

  getRiskText(riskLevel: string): string {
    switch (riskLevel) {
      case 'HIGH':
        return 'High risk';
      case 'NO':
      case 'LOW':
        return 'No risk';
      default:
        return 'Unknown';
    }
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.sortedWorkations = [...this.workations].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'employee':
          aValue = a.employee;
          bValue = b.employee;
          break;
        case 'origin':
          aValue = a.origin;
          bValue = b.origin;
          break;
        case 'destination':
          aValue = a.destination;
          bValue = b.destination;
          break;
        case 'start':
        case 'end':
          aValue = new Date(a[field as keyof Workation] as string);
          bValue = new Date(b[field as keyof Workation] as string);
          break;
        case 'workingDays':
          aValue = a.workingDays;
          bValue = b.workingDays;
          break;
        case 'risk':
          const riskOrder = { 'HIGH': 3, 'NO': 2, 'LOW': 1 };
          aValue = riskOrder[a.risk as keyof typeof riskOrder] || 0;
          bValue = riskOrder[b.risk as keyof typeof riskOrder] || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getSortIcon(field: string): string {
    return this.sortDirection === 'asc' ? '↑↓' : '↑↓';
  }

  isSorted(field: string): boolean {
    return this.sortField === field;
  }
}