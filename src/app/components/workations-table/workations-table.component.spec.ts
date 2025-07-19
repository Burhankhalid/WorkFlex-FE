import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkationsTableComponent } from './workations-table.component';

describe('WorkationsTableComponent', () => {
  let component: WorkationsTableComponent;
  let fixture: ComponentFixture<WorkationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkationsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
