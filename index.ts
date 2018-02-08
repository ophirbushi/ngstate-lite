import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

class Reducer<T, A> {
    constructor(public reduce: (this: Reducer<T, A>, state: T, action: keyof A, payload: A[keyof A]) => T) { }

    public is<K extends keyof A>(name: K, action: keyof A, payload?: A[keyof A]): payload is A[K] {
        return action === name;
    }
}

class Effects<T, A>{
    actionDispatched: Subject<{ action: keyof A, payload: A[keyof A] }> = new Subject();
    actionDispatchedFromEffects: Subject<{ action: keyof A, payload: A[keyof A] }> = new Subject();

    actionOfType<K extends keyof A>(action: K): Observable<A[K]> {
        return this.actionDispatched
            .filter(couple => couple.action === action)
            .map(couple => <any>couple.payload);
    }

    dispatch<K extends keyof A>(action: K, payload: A[K]) {
        this.actionDispatchedFromEffects.next({ action, payload });
    }
}

class Store<T, A> extends BehaviorSubject<T> {

    constructor(
        initialValue: T,
        private reducer: Reducer<T, A>,
        private effects?: Effects<T, A>
    ) {
        super(initialValue);
    }

    dispatch<ActionType extends keyof A>(
        action: ActionType,
        payload?: A[ActionType]
    ) {
        this.next(this.reducer.reduce(this.value, action, payload));
        if (this.effects) {
            this.effects.actionDispatchedFromEffects.subscribe((couple) => {
                this.dispatch(couple.action, couple.payload);
            });
            this.effects.actionDispatched.next({ action, payload });
        }
    }
}


interface NameStore { name: string }

interface NameStoreActions {
    'setName': string;
    'deleteName': any;
    'shortenName': number;
}

const reducer = new Reducer<NameStore, NameStoreActions>(function (state, action, payload) {
    if (this.is('setName', action, payload)) {
        return { ...state, name: payload };
    }
    if (this.is('deleteName', action)) {
        return { ...state, name: null };
    }
    if (this.is('shortenName', action, payload)) {
        return { ...state, name: state.name.substring(0, state.name.length - payload) };
    }
    return state;
});

const effects = new Effects<NameStore, NameStoreActions>();

effects.actionOfType('setName')
    .subscribe((payload) => {
        effects.dispatch('shortenName', 1);
    });

const store = new Store<NameStore, NameStoreActions>({ name: null }, reducer, effects);

store.subscribe(console.log)

store.dispatch('setName', 'Marketplace');
store.dispatch('shortenName', 3);
store.dispatch('deleteName');
