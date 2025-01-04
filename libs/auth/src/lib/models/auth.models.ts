export interface User {
    name: string;
}

export type SessionState = 'none' | 'loading' | 'error' | 'success';
