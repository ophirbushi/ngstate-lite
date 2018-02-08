"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("rxjs/Subject");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
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
    }
    dispatch(action, payload) {
        this.next(this.reducer.reduce(this.value, action, payload));
        if (this.effects) {
            this.effects.actionDispatchedFromEffects.subscribe((couple) => {
                this.dispatch(couple.action, couple.payload);
            });
            this.effects.actionDispatched.next({ action, payload });
        }
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
    return state;
});
const effects = new Effects();
effects.actionOfType('setName')
    .subscribe((payload) => {
    effects.dispatch('shortenName', 1);
});
const store = new Store({ name: null }, reducer, effects);
store.subscribe(console.log);
store.dispatch('setName', 'Marketplace');
store.dispatch('shortenName', 3);
store.dispatch('deleteName');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUF1QztBQUN2QywwREFBdUQ7QUFDdkQsb0NBQWtDO0FBQ2xDLGlDQUErQjtBQUcvQjtJQUNJLFlBQW1CLE1BQWtGO1FBQWxGLFdBQU0sR0FBTixNQUFNLENBQTRFO0lBQUksQ0FBQztJQUVuRyxFQUFFLENBQW9CLElBQU8sRUFBRSxNQUFlLEVBQUUsT0FBb0I7UUFDdkUsTUFBTSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBRUQ7SUFBQTtRQUNJLHFCQUFnQixHQUFzRCxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUNwRixnQ0FBMkIsR0FBc0QsSUFBSSxpQkFBTyxFQUFFLENBQUM7SUFXbkcsQ0FBQztJQVRHLFlBQVksQ0FBb0IsTUFBUztRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQjthQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQzthQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBTSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELFFBQVEsQ0FBb0IsTUFBUyxFQUFFLE9BQWE7UUFDaEQsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FDSjtBQUVELFdBQWtCLFNBQVEsaUNBQWtCO0lBRXhDLFlBQ0ksWUFBZSxFQUNQLE9BQXNCLEVBQ3RCLE9BQXVCO1FBRS9CLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUhaLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFDdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7SUFHbkMsQ0FBQztJQUVELFFBQVEsQ0FDSixNQUFrQixFQUNsQixPQUF1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