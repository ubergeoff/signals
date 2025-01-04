import { Component, inject } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '@flights/auth';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'flights-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
    imports: [
        NzBreadCrumbModule,
        NzLayoutModule,
        NzMenuModule,
        RouterOutlet,
        NzButtonModule,
        NzSpinModule,
        NzIconModule
    ],
    providers: [CookieService],
    standalone: true
})
export class LayoutComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    user = this.authService.user;
    authStatus = this.authService.currentStatus;

    async logout(): Promise<void> {
        await this.authService.logout();
        this.router.navigate(['/login']);
    }

    isAuthLoading(): boolean {
        return this.authService.currentStatus() === 'loading';
    }
}
