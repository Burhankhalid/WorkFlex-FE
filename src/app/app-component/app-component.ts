import { Component } from '@angular/core';
import { Api } from '../services/api';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-app-component',
  templateUrl: './app-component.html',
  styleUrl: './app-component.scss',
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(private api: Api) {}

  login() {
    this.api.login({ username: 'test', password: 'pass' }).subscribe({
      next: (res: any) => console.log('Login success:', res),
      error: (err) => console.error('Login error:', err),
    });
  }
}
