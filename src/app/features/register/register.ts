import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = '';

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*'),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+385|0)([0-9]{8,9})$/),
    ]),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const { email, firstName, lastName, password, phone } = this.form.value;
    this.authService.register(firstName!, lastName!, email!, password!, phone!).subscribe({
      next: () =>
        this.authService.getCurrentUser().subscribe({
          next: () => this.router.navigate(['/home']),
        }),
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Registracija neuspješna.';
        }
      },
    });
  }

  ngOnInit() {
    this.authService.clearToken();
  }
}
