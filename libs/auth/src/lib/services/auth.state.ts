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
export class AuthStateMonkey {
    private initialState: UserState = {
        user: { name: '' },
        loggedIn: false,
        currentState: 'none',
        currentMessage: 'none'
    };
    private state = signal<UserState>(this.initialState);

    user = computed(() => this.state().user, { equal });
    currentMessage = computed(
        () => {
            const msg = this.state().currentMessage;

            if (msg.indexOf('param:') >= 0) {
                return msg.split('param:')[1];
            }
            return msg;
        },
        { equal }
    );
    isLoggedIn = computed(() => this.state().loggedIn, { equal });
    currentStatus = computed(() => this.state().currentState, {
        equal
    });

    private patchState(action: Partial<UserState>): void {
        patchSignal(this.state, action);
    }

    setStatus(currentState: SessionState): void {
        this.patchState({ currentState });
    }

    setSession(user: User): void {
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
