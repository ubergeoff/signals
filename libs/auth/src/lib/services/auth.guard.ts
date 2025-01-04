import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export function authenticationGuard(): CanActivateFn {
    return () => {
        const isActive = inject(AuthService).isLoggedIn();

        if (!isActive) {
            inject(Router).navigate(['/login']);
        }

        return isActive;
    };
}
