import { AbstractControl, ValidationErrors } from '@angular/forms';

export class WhiteSpaceValidator {
    static noWhiteSpace(control: AbstractControl): ValidationErrors | null {
        if (!control.value?.trim()) {
            return { noWhiteSpace: true };
        }
        return null;
    }
}
