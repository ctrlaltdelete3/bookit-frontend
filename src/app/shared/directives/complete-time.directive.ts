import { Directive, ElementRef, inject } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

// A partially typed <input type="time"> (e.g. "08:08 --" without AM/PM) reports its value as "",
// so for Angular the field looks empty. The browser knows the input is incomplete (validity.badInput),
// and this directive turns that into an 'incompleteTime' validation error on the form control.
@Directive({
  selector: 'input[type=time][appCompleteTime]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CompleteTimeDirective, multi: true }],
  host: {
    '(keyup)': 'revalidate()',
    '(change)': 'revalidate()',
    '(blur)': 'revalidate()',
  },
})
export class CompleteTimeDirective implements Validator {
  private element = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private onValidatorChange = () => {};

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.element.nativeElement.validity.badInput ? { incompleteTime: true } : null;
  }

  // Angular gives us a function that re-runs validation for this control
  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  // typing a partial time doesn't change the value (it stays ""), so Angular wouldn't re-validate on its own
  protected revalidate() {
    this.onValidatorChange();
  }
}
