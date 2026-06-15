import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);

  get IsLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout().subscribe();
  }
}
