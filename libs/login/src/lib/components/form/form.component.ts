import { Component, inject } from '@angular/core';
import {
    FormControl,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '@flights/auth';

@Component({
    selector: 'flights-login-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    imports: [
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzCheckboxModule,
        NzButtonModule
    ],
    standalone: true
})
export class FormComponent {
    authService = inject(AuthService);

    validateForm: FormGroup<{
        userName: FormControl<string>;
        password: FormControl<string>;
        remember: FormControl<boolean>;
    }> = this.fb.group({
        userName: ['', [Validators.required]],
        password: ['', [Validators.required]],
        remember: [true]
    });

    submitForm(): void {
        if (this.validateForm.valid) {
            const { userName, password } = this.validateForm.value;
            console.log(userName, password);

            this.authService.login('mince@mean.com', 'TeamViewer');
            /*if (userName && password) {
                this.authService.login(userName, password);
            }*/
        } else {
            Object.values(this.validateForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    constructor(private fb: NonNullableFormBuilder) {}
}
