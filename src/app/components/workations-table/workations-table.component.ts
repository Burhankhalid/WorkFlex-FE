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
    'DE': 'https://flagcdn.com/de.svg',
    'US': 'https://flagcdn.com/us.svg', 
    'UA': 'https://flagcdn.com/ua.svg',
    'BE': 'https://flagcdn.com/be.svg',
    'ES': 'https://flagcdn.com/es.svg',
    'GR': 'https://flagcdn.com/gr.svg',
    'IN': 'https://flagcdn.com/in.svg'
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

  // Add the missing trackBy function
  trackByWorkation(index: number, workation: Workation): any {
    // Use a unique identifier for each workation
    // Assuming each workation has unique combination of employee, start, and destination
    return `${workation.employee}-${workation.start}-${workation.destination.code}`;
  }

  getCountryFlag(countryCode: string): string {
    return this.countryFlags[countryCode] || '🏳️';
  }


  getRiskClass(riskLevel: string): string {
    switch (riskLevel) {
      case 'HIGH_RISK':
        return 'risk-high';
      case 'NO_RISK':
        return 'risk-no';
      case 'LOW_RISK':
        return 'risk-low';
      default:
        return 'risk-unknown';
    }
  }

  getRiskIcon(riskLevel: string): string {
    switch (riskLevel) {
      case 'HIGH_RISK':
        return './app-assets/images/red-risk.svg';
      case 'NO_RISK':
        return './app-assets/images/yellow-risk.svg';
      case 'LOW_RISK':
        return './app-assets/images/green-risk.svg';
      default:
        return './app-assets/images/yellow-risk.svg';
    }
  }

  getRiskText(riskLevel: string): string {
    switch (riskLevel) {
      case 'HIGH_RISK':
        return 'High risk';
      case 'NO_RISK':
      case 'LOW_RISK':
        return 'No risk';
      default:
        return 'Unknown';
    }
  }

  // getRiskIcon(riskLevel: string): string {
  //   switch (riskLevel) {
  //     case 'HIGH_RISK':
  //       return '🛡️⚠️';
  //     case 'NO_RISK':
  //       return '🛡️🟠';
  //     case 'LOW_RISK':
  //       return '🛡️✅';
  //     default:
  //       return '🛡️';
  //   }
  // }

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
          aValue = a.origin.country;
          bValue = b.origin.country;
          break;
        case 'destination':
          aValue = a.destination.country;
          bValue = b.destination.country;
          break;
        case 'start':
        case 'end':
          aValue = this.parseDate(a[field as keyof Workation] as string);
          bValue = this.parseDate(b[field as keyof Workation] as string);
          break;
        case 'workingDays':
          aValue = a.workingDays;
          bValue = b.workingDays;
          break;
        case 'risk':
          const riskOrder = { 'HIGH_RISK': 3, 'NO_RISK': 2, 'LOW_RISK': 1 };
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

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }


  getSortIcon(field: string): string {
    
    return this.sortDirection === 'asc' ? '↑↓' : '↑↓';
  }

  isSorted(field: string): boolean {
    return this.sortField === field;
  }
}