"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/distinctUntilChanged");
class Reducer {
    constructor(reduce) {
        this.reduce = reduce;
    }
    is(name, action, payload) {
        return action === name;
    }
}
class Effects {
    constructor() {
        this.actionDispatched = new Subject_1.Subject();
        this.actionDispatchedFromEffects = new Subject_1.Subject();
    }
    actionOfType(action) {
        return this.actionDispatched
            .filter(couple => couple.action === action)
            .map(couple => couple.payload);
    }
    dispatch(action, payload) {
        this.actionDispatchedFromEffects.next({ action, payload });
    }
}
class Store extends BehaviorSubject_1.BehaviorSubject {
    constructor(initialValue, reducer, effects) {
        super(initialValue);
        this.reducer = reducer;
        this.effects = effects;
        if (this.effects) {
            this.effects.actionDispatchedFromEffects
                .subscribe((couple) => {
                this.dispatch(couple.action, couple.payload);
            });
        }
    }
    dispatch(action, payload) {
        this.next(this.reducer.reduce(this.value, action, payload));
        if (this.effects) {
            this.effects.actionDispatched.next({ action, payload });
        }
    }
    select(keyOrMapFn) {
        const mapFn = typeof keyOrMapFn === 'string' ? value => value[keyOrMapFn] : keyOrMapFn;
        return this.asObservable()
            .map(mapFn)
            .distinctUntilChanged();
    }
}
const reducer = new Reducer(function (state, action, payload) {
    if (this.is('setName', action, payload)) {
        return Object.assign({}, state, { name: payload });
    }
    if (this.is('deleteName', action)) {
        return Object.assign({}, state, { name: null });
    }
    if (this.is('shortenName', action, payload)) {
        return Object.assign({}, state, { name: state.name.substring(0, state.name.length - payload) });
    }
    if (this.is('setSize', action, payload)) {
        return Object.assign({}, state, { size: payload });
    }
    return state;
});
const effects = new Effects();
effects.actionOfType('setName')
    .subscribe((payload) => {
    effects.dispatch('shortenName', 1);
});
effects.actionOfType('setSize')
    .subscribe((payload) => {
    effects.dispatch('setName', 'now we are ' + payload);
});
const store = new Store({ name: null, size: null }, reducer, effects);
//store.subscribe(console.log)
const size$ = store.select('size');
store.dispatch('setName', 'Marketplace');
store.dispatch('setSize', 'big');
store.dispatch('shortenName', 3);
store.dispatch('deleteName');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUN2QywwREFBdUQ7QUFDdkQsb0NBQWtDO0FBQ2xDLGlDQUErQjtBQUMvQixrREFBZ0Q7QUFHaEQ7SUFDSSxZQUFtQixNQUFrRjtRQUFsRixXQUFNLEdBQU4sTUFBTSxDQUE0RTtJQUFJLENBQUM7SUFFbkcsRUFBRSxDQUFvQixJQUFPLEVBQUUsTUFBZSxFQUFFLE9BQW9CO1FBQ3ZFLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQUVEO0lBQUE7UUFDSSxxQkFBZ0IsR0FBc0QsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDcEYsZ0NBQTJCLEdBQXNELElBQUksaUJBQU8sRUFBRSxDQUFDO0lBV25HLENBQUM7SUFURyxZQUFZLENBQW9CLE1BQVM7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7YUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7YUFDMUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxRQUFRLENBQW9CLE1BQVMsRUFBRSxPQUFhO1FBQ2hELElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0o7QUFFRCxXQUFrQixTQUFRLGlDQUFrQjtJQUV4QyxZQUNJLFlBQWUsRUFDUCxPQUFzQixFQUN0QixPQUF1QjtRQUUvQixLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFIWixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSS9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FB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