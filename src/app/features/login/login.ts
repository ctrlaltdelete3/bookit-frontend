import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal('');

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    // login only checks that a password was entered - complexity rules belong to registration
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show validation messages instead of silently doing nothing
      return;
    }
    this.errorMessage.set(''); // clear the previous error before a new attempt
    const { email, password } = this.form.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.authService.getCurrentUser().subscribe({
          next: () => this.router.navigate(['/home']),
        });
      },
      error: () => this.errorMessage.set('Wrong username or password'),
    });
  }

  ngOnInit(): void {
    this.authService.clearToken();
  }
}
