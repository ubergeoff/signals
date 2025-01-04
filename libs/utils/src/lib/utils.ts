import { WritableSignal } from '@angular/core';
import { SignalStateUpdater } from '@flights/signal-store';
import { produce } from 'immer';

export function equal<T>(a: T, b: T): boolean {
    return a === b;
}

export function patchSignal<T>(
    signal: WritableSignal<T>,
    partialState: Partial<T>
): void {
    signal.update((state) => ({
        ...state,
        ...partialState
    }));
}

export function immerUpdater<State extends Record<string, unknown>>(
    updater: (state: State) => void
): SignalStateUpdater<State> {
    return (state) => produce(state, (draft) => updater(draft as State));
}
