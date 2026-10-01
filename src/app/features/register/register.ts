import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordRules, passwordValidators } from '../../shared/validators/password.validators';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = signal('');
  protected passwordRules = passwordRules;

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
    password: new FormControl('', passwordValidators),
    phone: new FormControl('', [
      Validators.required,
      // spaces between digits are allowed (e.g. "099 123 4567"), they are removed before sending
      Validators.pattern(/^\s*(\+385|0)(\s*[0-9]){8,9}\s*$/),
    ]),
  });

  // empty password: minlength doesn't report an error (only required does), so check the value too
  protected isPasswordRuleMet(errorKey: string): boolean {
    const password = this.form.controls.password;
    return !!password.value && !password.hasError(errorKey);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show validation messages instead of silently doing nothing
      return;
    }
    this.errorMessage.set(''); // clear the previous error before a new attempt

    const { email, firstName, lastName, password, phone } = this.form.value;
    const normalizedPhone = phone!.replace(/\s/g, ''); // "099 123 4567" -> "0991234567", the format backend expects
    this.authService.register(firstName!, lastName!, email!, password!, normalizedPhone).subscribe({
      next: () =>
        this.authService.getCurrentUser().subscribe({
          next: () => this.router.navigate(['/home']),
        }),
      error: (err: HttpErrorResponse) => {
        const validationErrors = err.error?.errors;
        if (validationErrors) {
          // backend validation (400): { message, errors: { field: [messages] } }
          this.errorMessage.set((Object.values(validationErrors).flat() as string[]).join(' '));
        } else if (err.status === 400 && err.error?.message) {
          // business error from ExceptionHandlingMiddleware (400), e.g. "Email already exists."
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Registracija neuspješna.');
        }
      },
    });
  }

  ngOnInit() {
    this.authService.clearToken();
  }
}
