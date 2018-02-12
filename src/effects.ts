import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

export class Effects<T, A>{
    actions$: Observable<{ action: keyof A, payload: A[keyof A] }>;

    dispatch: <K extends keyof A>(action: K, payload: A[K]) => void;

    constructor(public registerEffects: (this: Effects<T, A>) => void = () => { }) { }

    actionOfType<K extends keyof A>(action: K): Observable<A[K]> {
        return this.actions$
            .pipe(filter(couple => couple.action === action))
            .pipe(map(couple => <any>couple.payload));
    }
}
