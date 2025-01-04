import { inject, Injectable } from '@angular/core';
import { Account, AppwriteException } from 'appwrite';
import { AppwriteService, dateAdd } from '@flights/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/auth.models';
import { AuthStateService } from './auth-store.service';
import { rxMethod } from '@flights/signal-store';
import { catchError, from, pipe, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState = inject(AuthStateService);
    private appWrite = inject(AppwriteService);
    private message = inject(NzMessageService);
    private cookies = inject(CookieService);
    private account = new Account(this.appWrite.client());

    currentStatus = this.authState.currentStatus;
    user = this.authState.user;
    isLoggedIn = this.authState.isLoggedIn;
    currentMessage = this.authState.currentMessage;

    private serviceCheck = rxMethod<void>(
        pipe(
            tap(() => this.authState.setStatus('loading')),
            switchMap(() => from(this.account.get())),
            tap((response) => {
                const user: User = { name: response.name };

                this.setCookieSession(user);
                this.authState.setSession(user);
            }),
            catchError((error) => {
                if (error instanceof AppwriteException) {
                    console.log(error.message);
                } else {
                    console.log(error);
                }

                this.authState.setStatus('none');
                return '';
            })
        )
    );

    private logInSession = rxMethod<{ email: string; password: string }>(
        pipe(
            tap(() => this.authState.setStatus('loading')),
            switchMap((t) =>
                from(this.account.createEmailSession(t.email, t.password))
            ),
            switchMap(() => from(this.account.get())),
            tap((t) => {
                const user: User = { name: t.name };

                this.setCookieSession(user);
                this.authState.setSession(user);
            }),
            catchError((e) => {
                if (e instanceof AppwriteException) {
                    this.authState.setError(e.message);
                } else {
                    this.authState.setError('Error here');
                }
                return '';
            })
        )
    );

    async init(): Promise<void> {
        if (this.cookies.check('app_session')) {
            const user = JSON.parse(this.cookies.get('app_session'));
            this.authState.setSession(user);
        } else {
            this.serviceCheck();
        }
    }

    async logout(): Promise<void> {
        this.authState.setStatus('loading');

        try {
            await this.account.deleteSessions();
        } catch (e) {
            console.log(e);
        } finally {
            this.cookies.delete('app_session', '/');
            this.authState.clearSession();

            this.message.info('Successfully logged out', {
                nzDuration: 5000,
                nzPauseOnHover: true
            });
        }
    }

    async login(email: string, password: string): Promise<void> {
        if (this.authState.isLoggedIn()) {
            return;
        }

        this.logInSession({ email, password });

        /*this.authState.setStatus('loading');

        try {
            await this.account.createEmailSession(email, password);
            const response = await this.account.get();

            const user = { name: response.name };

            this.setCookieSession(user);
            this.authState.setSession(user);
        } catch (e: unknown) {
            console.log(e);

            if (e instanceof AppwriteException) {
                this.authState.setError(e.message);
            } else {
                this.authState.setError('Error here');
            }
        }*/
    }

    private setCookieSession(user: { name: string }): void {
        const ttlDate = dateAdd(new Date(), 'minutes', 5);

        this.cookies.set('app_session', JSON.stringify(user), {
            sameSite: 'Strict',
            expires: ttlDate,
            path: '/'
        });
    }
}
