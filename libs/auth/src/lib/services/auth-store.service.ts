import { Injectable } from '@angular/core';
import { selectSignal, signalState } from '@flights/signal-store';
import { SessionState, User } from '../models/auth.models';

type UserState = {
    user: User;
    loggedIn: boolean;
    currentState: SessionState;
    currentMessage: string;
};

const initialState: UserState = {
    user: { name: '' },
    loggedIn: false,
    currentState: 'none',
    currentMessage: 'none'
};

@Injectable({ providedIn: 'root' })
export class AuthStateService {
    private state = signalState<UserState>(initialState);

    user = this.state.user;
    isLoggedIn = this.state.loggedIn;
    currentStatus = this.state.currentState;

    currentMessage = selectSignal(this.state.currentMessage, (message) => {
        if (message.indexOf('param:') >= 0) {
            return message.split('param:')[1];
        }
        return message;
    });

    setStatus(currentState: SessionState): void {
        this.state.$update({ currentState });
    }

    setSession(user: User): void {
        this.state.$update({
            loggedIn: true,
            currentState: 'success',
            user: user,
            currentMessage: ''
        });
    }

    clearSession(): void {
        this.state.$update(initialState);
    }

    setError(message: string): void {
        this.state.$update({
            loggedIn: false,
            user: { name: '' },
            currentState: 'error',
            currentMessage: message
        });
    }
}
