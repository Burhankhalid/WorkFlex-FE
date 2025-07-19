import { Routes } from '@angular/router';
import { WorkationsTableComponent } from './components/workations-table/workations-table.component';

export const routes: Routes = [
  { path: '', redirectTo: '/workations', pathMatch: 'full' },
  { path: 'workations', component: WorkationsTableComponent },
  { path: '**', redirectTo: '/workations' }
];