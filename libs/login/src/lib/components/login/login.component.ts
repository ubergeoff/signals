import { Component, effect, inject, OnInit } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgClass, NgIf } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { Router } from '@angular/router';
import { AuthService } from '@flights/auth';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormComponent } from '../form/form.component';

@Component({
    selector: 'flights-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [
        NgIf,
        NzSpinModule,
        NzButtonModule,
        NzInputModule,
        FormsModule,
        NzAlertModule,
        NgClass,
        NzLayoutModule,
        FormComponent
    ],
    standalone: true
})
export class LoginComponent implements OnInit {
    username?: string;
    password?: string;

    auth = inject(AuthService);
    router = inject(Router);

    constructor() {
        effect(() => {
            if (this.auth.isLoggedIn()) {
                this.router.navigate(['/home/cart']);
            }
        });
    }

    ngOnInit(): void {
        this.auth.init();
    }

    async login(): Promise<void> {
        await this.auth.login('mince@mean.com', 'TeamViewer');
        /*if (this.username && this.password) {
            await this.auth.login(this.username, this.password);
        }*/
    }
}
