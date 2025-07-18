import { Routes } from '@angular/router';
import { AppComponent } from './app-component/app-component';
import { App } from './app';

export const routes: Routes = [
  { path: '', component: App },
  { path: 'login', component: AppComponent },
];
