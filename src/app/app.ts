import { Component, signal } from '@angular/core';
import { Api } from './services/api';
import { AppComponent } from './app-component/app-component';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [AppComponent],
})
export class App {
  constructor(private api: Api) {}
  login() {
    this.api.login({ username: 'test', password: 'pass' }).subscribe({
      next: (res: any) => console.log('Login success:', res),
      error: (err) => console.error('Login error:', err),
    });
  }
}
