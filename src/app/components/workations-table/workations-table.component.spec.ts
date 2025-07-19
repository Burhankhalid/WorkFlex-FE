import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { WorkationsTableComponent } from './workations-table.component';
import { WorkationService } from '../../services/workation.service';
import { Workation } from '../../models/workation.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WorkationsTableComponent', () => {
  let component: WorkationsTableComponent;
  let fixture: ComponentFixture<WorkationsTableComponent>;
  let mockWorkationService: jasmine.SpyObj<WorkationService>;

  const mockWorkations: Workation[] = [
    {
      workationId: '1',
      employee: 'John Doe',
      origin: 'Germany',
      destination: 'Spain',
      start: '2024-01-15',
      end: '2024-01-30',
      workingDays: 10,
      risk: 'LOW'
    },
    {
      workationId: '2',
      employee: 'Jane Smith',
      origin: 'United States',
      destination: 'Greece',
      start: '2024-02-01',
      end: '2024-02-14',
      workingDays: 8,
      risk: 'HIGH'
    },
    {
      workationId: '3',
      employee: 'Bob Wilson',
      origin: 'Belgium',
      destination: 'India',
      start: '2024-03-01',
      end: '2024-03-15',
      workingDays: 12,
      risk: 'NO'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WorkationService', ['getWorkations']);

    await TestBed.configureTestingModule({
      imports: [WorkationsTableComponent, CommonModule, HttpClientModule],
      providers: [
        { provide: WorkationService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkationsTableComponent);
    component = fixture.componentInstance;
    mockWorkationService = TestBed.inject(WorkationService) as jasmine.SpyObj<WorkationService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.workations).toEqual([]);
      expect(component.sortedWorkations).toEqual([]);
      expect(component.loading).toBe(true);
      expect(component.error).toBe(null);
      expect(component.sortField).toBe('');
      expect(component.sortDirection).toBe('asc');
    });

    it('should call loadWorkations on ngOnInit', () => {
      spyOn(component, 'loadWorkations');
      component.ngOnInit();
      expect(component.loadWorkations).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should load workations successfully', () => {
      mockWorkationService.getWorkations.and.returnValue(of(mockWorkations));

      component.loadWorkations();

      expect(mockWorkationService.getWorkations).toHaveBeenCalled();
      expect(component.workations).toEqual(mockWorkations);
      expect(component.sortedWorkations).toEqual(mockWorkations);
      expect(component.loading).toBe(false);
      expect(component.error).toBe(null);
    });

    it('should handle loading error', () => {
      const errorResponse = new Error('Network error');
      mockWorkationService.getWorkations.and.returnValue(throwError(() => errorResponse));
      spyOn(console, 'error');

      component.loadWorkations();

      expect(component.loading).toBe(false);
      expect(component.error).toBe('Failed to load workations data');
      expect(console.error).toHaveBeenCalledWith('Error loading workations:', errorResponse);
    });



    it('should retry loading when retry button is clicked', () => {
      mockWorkationService.getWorkations.and.returnValue(throwError(() => new Error('Test error')));
      fixture.detectChanges();
      
      spyOn(component, 'loadWorkations');
      const retryButton = fixture.debugElement.query(By.css('.retry-button'));
      retryButton.triggerEventHandler('click', null);

      expect(component.loadWorkations).toHaveBeenCalled();
    });
  });


  describe('Sorting Functionality', () => {
    beforeEach(() => {
      component.workations = [...mockWorkations];
      component.sortedWorkations = [...mockWorkations];
    });

    it('should sort by employee name ascending', () => {
      component.sort('employee');
      
      expect(component.sortField).toBe('employee');
      expect(component.sortDirection).toBe('asc');
      expect(component.sortedWorkations[0].employee).toBe('Bob Wilson');
      expect(component.sortedWorkations[2].employee).toBe('John Doe');
    });

    it('should toggle sort direction when sorting same field', () => {
      component.sort('employee');
      expect(component.sortDirection).toBe('asc');
      
      component.sort('employee');
      expect(component.sortDirection).toBe('desc');
      expect(component.sortedWorkations[0].employee).toBe('John Doe');
      expect(component.sortedWorkations[2].employee).toBe('Bob Wilson');
    });

    it('should sort by working days numerically', () => {
      component.sort('workingDays');
      
      expect(component.sortedWorkations[0].workingDays).toBe(8);
      expect(component.sortedWorkations[2].workingDays).toBe(12);
    });

    it('should sort by risk level with correct priority', () => {
      component.sort('risk');
      
      // Risk order: LOW=1, NO=2, HIGH=3, so ascending should be LOW, NO, HIGH
      expect(component.sortedWorkations[0].risk).toBe('LOW');
      expect(component.sortedWorkations[1].risk).toBe('NO');
      expect(component.sortedWorkations[2].risk).toBe('HIGH');
    });

    it('should sort by dates correctly', () => {
      component.sort('start');
      
      expect(component.sortedWorkations[0].start).toBe('2024-01-15');
      expect(component.sortedWorkations[2].start).toBe('2024-03-01');
    });

    it('should return correct sort icon', () => {
      expect(component.getSortIcon('employee')).toBe('↑↓');
    });

    it('should identify sorted field correctly', () => {
      component.sortField = 'employee';
      
      expect(component.isSorted('employee')).toBe(true);
      expect(component.isSorted('origin')).toBe(false);
    });
  });


  describe('Template Rendering', () => {
    beforeEach(() => {
      mockWorkationService.getWorkations.and.returnValue(of(mockWorkations));
      fixture.detectChanges();
    });

    it('should render table with correct number of rows', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(mockWorkations.length);
    });

    it('should render employee names correctly', () => {
      const employeeCells = fixture.debugElement.queryAll(By.css('.employee-cell'));
      expect(employeeCells[0].nativeElement.textContent.trim()).toBe('John Doe');
      expect(employeeCells[1].nativeElement.textContent.trim()).toBe('Jane Smith');
    });

    it('should render country flags with correct attributes', () => {
      const flagImages = fixture.debugElement.queryAll(By.css('.flag'));
      expect(flagImages.length).toBeGreaterThan(0);
      
      const firstFlag = flagImages[0].nativeElement;
      expect(firstFlag.src).toBe('https://flagcdn.com/de.svg');
      expect(firstFlag.alt).toBe('DE flag');
      expect(firstFlag.style.width).toBe('24px');
    });

    it('should render risk information correctly', () => {
      const riskCells = fixture.debugElement.queryAll(By.css('.risk-cell'));
      expect(riskCells.length).toBe(mockWorkations.length);
      
      const riskIcons = fixture.debugElement.queryAll(By.css('.risk-icon'));
      expect(riskIcons.length).toBe(mockWorkations.length);
    });

    it('should handle sorting clicks on headers', () => {
      spyOn(component, 'sort');
      
      const employeeHeader = fixture.debugElement.query(By.css('th[class*="sortable-header"]'));
      employeeHeader.triggerEventHandler('click', null);
      
      expect(component.sort).toHaveBeenCalled();
    });

    it('should apply sorted class to active column header', () => {
      component.sortField = 'employee';
      fixture.detectChanges();
      
      const headers = fixture.debugElement.queryAll(By.css('th'));
      const employeeHeader = headers[0];
      
      expect(employeeHeader.classes['sorted']).toBe(true);
    });

    it('should display working days correctly', () => {
      const workingDaysCells = fixture.debugElement.queryAll(By.css('.working-days-cell'));
      expect(workingDaysCells[0].nativeElement.textContent.trim()).toBe('10');
      expect(workingDaysCells[1].nativeElement.textContent.trim()).toBe('8');
    });

    it('should display dates correctly', () => {
      const dateCells = fixture.debugElement.queryAll(By.css('.date-cell'));
      expect(dateCells[0].nativeElement.textContent.trim()).toBe('2024-01-15');
      expect(dateCells[1].nativeElement.textContent.trim()).toBe('2024-01-30');
    });
  });

});