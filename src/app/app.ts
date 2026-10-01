import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  protected readonly title = signal('bookit-frontend');

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({ error: () => {} });
    }
  }
}
