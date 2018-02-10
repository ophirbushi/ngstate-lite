import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

class Reducer<T, A> {
    constructor(public reduce: (this: Reducer<T, A>, state: T, action: keyof A, payload: A[keyof A]) => T) { }

    public is<K extends keyof A>(name: K, action: keyof A, payload?: A[keyof A]): payload is A[K] {
        return action === name;
    }
}

class Effects<T, A>{
    actionDispatched: Subject<{ action: keyof A, payload: A[keyof A] }> = new Subject();

    dispatch: <K extends keyof A>(action: K, payload: A[K]) => void;

    actionOfType<K extends keyof A>(action: K): Observable<A[K]> {
        return this.actionDispatched
            .filter(couple => couple.action === action)
            .map(couple => <any>couple.payload);
    }
}

class Store<T, A> extends BehaviorSubject<T> {

    constructor(
        initialValue: T,
        private reducer: Reducer<T, A>,
        private effects?: Effects<T, A>
    ) {
        super(initialValue);
        if (this.effects) this.effects.dispatch = this.dispatch;
    }

    dispatch<ActionType extends keyof A>(
        action: ActionType,
        payload?: A[ActionType]
    ) {
        this.next(this.reducer.reduce(this.value, action, payload));
        if (this.effects) {
            this.effects.actionDispatched.next({ action, payload });
        }
    }

    select<K extends keyof T>(key: K): Observable<T[K]>
    select<K extends keyof T>(mapFunction: (value: T) => T[K]): Observable<T[K]>
    select<K extends keyof T>(keyOrMapFn: (K) | ((value: T) => T[K])): Observable<T[K]> {
        const mapFn: (value: T) => T[K] = typeof keyOrMapFn === 'string' ? value => value[keyOrMapFn] : keyOrMapFn;
        return this.asObservable()
            .map(mapFn)
            .distinctUntilChanged();
    }
}


type StoreSize = 'small' | 'medium' | 'big';
interface NameStore { name: string, size: StoreSize }

const SET_NAME = 'setName';
const SET_SIZE = 'setSize';
const DELETE_NAME = 'deleteName';
const SHORTEN_NAME = 'shortenName';

interface NameStoreActions {
    [SET_NAME]: string;
    [SET_SIZE]: StoreSize;
    [DELETE_NAME]: any;
    [SHORTEN_NAME]: number;
}

const reducer = new Reducer<NameStore, NameStoreActions>(
    function (state, action, payload) {
        if (this.is(SET_NAME, action, payload)) {
            return { ...state, name: payload };
        }
        if (this.is(DELETE_NAME, action)) {
            return { ...state, name: null };
        }
        if (this.is(SHORTEN_NAME, action, payload)) {
            return { ...state, name: state.name.substring(0, state.name.length - payload) };
        }
        if (this.is(SET_SIZE, action, payload)) {
            return { ...state, size: payload };
        }
        return state;
    }
);

const effects = new Effects<NameStore, NameStoreActions>();

effects.actionOfType(SET_NAME)
    .subscribe((payload) => {
        effects.dispatch(SHORTEN_NAME, 1);
    });

effects.actionOfType(SET_SIZE)
    .subscribe((payload) => {
        effects.dispatch(SET_NAME, 'now we are ' + payload);
    });

const store = new Store<NameStore, NameStoreActions>({ name: null, size: null }, reducer, effects);

//store.subscribe(console.log)

const size$ = store.select('size');

store.dispatch(SET_NAME, 'Marketplace');
store.dispatch(SET_SIZE, 'big');
store.dispatch(SHORTEN_NAME, 3);
store.dispatch(DELETE_NAME);

