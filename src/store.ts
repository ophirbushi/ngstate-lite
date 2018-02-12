import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Reducer } from './reducer';
import { Effects } from './effects';

import { map, distinctUntilChanged } from 'rxjs/operators';

export class Store<T, A> extends BehaviorSubject<T> {
    private actionDispatched = new Subject<{ action: keyof A, payload: A[keyof A] }>();
    actions$: Observable<{ action: keyof A, payload: A[keyof A] }> = this.actionDispatched.asObservable();

    constructor(
        initialValue: T,
        private reducer: Reducer<T, A>,
        private effects?: Effects<T, A>
    ) {
        super(initialValue);
        if (this.effects) {
            this.effects.actions$ = this.actions$;
            this.effects.dispatch = this.dispatch.bind(this);
            this.effects.registerEffects();
        }
    }

    dispatch<ActionType extends keyof A>(action: ActionType, payload: A[ActionType]) {
        this.next(this.reducer.reduce(this.value, action, payload));
        this.actionDispatched.next({ action, payload });
    }

    select<K extends keyof T>(key: K): Observable<T[K]>
    select<K extends keyof T>(mapFunction: (value: T) => T[K]): Observable<T[K]>
    select<K extends keyof T>(keyOrMapFn: (K) | ((value: T) => T[K])): Observable<T[K]> {
        const mapFn: (value: T) => T[K] = typeof keyOrMapFn === 'string' ? value => value[keyOrMapFn] : keyOrMapFn;
        return this.asObservable()
            .pipe(map(mapFn))
            .pipe(distinctUntilChanged());
    }
}
