import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// Same rules as RegisterRequestDtoValidator on the backend - keep them in sync.
// Each rule has its own error key, so the template can show exactly which rule is not met.

function requireCharacter(regex: RegExp, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    regex.test(control.value ?? '') ? null : { [errorKey]: true };
}

export const passwordValidators: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(8),
  requireCharacter(/[a-z]/, 'lowercase'),
  requireCharacter(/[A-Z]/, 'uppercase'),
  requireCharacter(/[0-9]/, 'number'),
  requireCharacter(/[^a-zA-Z0-9]/, 'special'),
];

export const passwordRules = [
  { errorKey: 'minlength', label: 'najmanje 8 znakova' },
  { errorKey: 'lowercase', label: 'malo slovo' },
  { errorKey: 'uppercase', label: 'veliko slovo' },
  { errorKey: 'number', label: 'broj' },
  { errorKey: 'special', label: 'poseban znak (npr. ! ? #)' },
];
