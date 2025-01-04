import { Route } from '@angular/router';
import { authenticationGuard } from '@flights/auth';
import { LayoutComponent } from './layout/layout.component';

export const appRoutes: Route[] = [
    {
        path: 'login',
        loadComponent: () =>
            import('@flights/login').then((module) => module.LoginComponent)
    },
    {
        path: 'c',
        canActivate: [authenticationGuard()],
        component: LayoutComponent,
        children: [
            {
                path: 'cart',
                loadComponent: () =>
                    import('@flights/cart').then(
                        (module) => module.CartComponent
                    )
            }
        ]
    }
];
