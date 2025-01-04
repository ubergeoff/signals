import { computed, Injectable, signal } from '@angular/core';
import { equal, patchSignal } from '@flights/utils';
import { SessionState, User } from '../models/auth.models';

export interface UserState {
    loggedIn: boolean;
    user: User;
    currentState: SessionState;
    currentMessage: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStateTakeTwo {
    private user = signal<User>({ name: '' });
    private loggedIn = signal<boolean>(false);
    private currentState = signal<SessionState>('none');
    private currentMessage = signal<string>('none');

    user$ = this.user.asReadonly();
    currentMessage$ = computed(
        () => {
            const msg = this.currentMessage();

            if (msg.indexOf('param:') >= 0) {
                return msg.split('param:')[1];
            }
            return msg;
        },
        { equal }
    );
    isLoggedIn$ = this.loggedIn.asReadonly();
    currentStatus$ = this.currentState.asReadonly();

    private patchState(action: Partial<UserState>): void {
        //this.state.user.update(...action.user)

        patchSignal(this.state, action);
    }

    setStatus(currentState: SessionState): void {
        this.patchState({ currentState });
    }

    setSession(user: User): void {
        this.loggedIn.set(true);
        this.currentState.set('success');
        this.user.set(user);
        this.currentMessage.set();

        this.patchState({
            loggedIn: true,
            currentState: 'success',
            user: user,
            currentMessage: ''
        });
    }

    clearSession(): void {
        this.patchState(this.initialState);
    }

    setError(message: string): void {
        this.patchState({
            loggedIn: false,
            user: { name: '' },
            currentState: 'error',
            currentMessage: message
        });
    }
}
