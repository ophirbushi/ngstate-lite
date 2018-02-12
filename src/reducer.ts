export class Reducer<T, A> {
    constructor(public reduce: (this: Reducer<T, A>, state: T, action: keyof A, payload: A[keyof A]) => T) { }

    public is<K extends keyof A>(name: K, action: keyof A, payload?: A[keyof A]): payload is A[K] {
        return action === name;
    }
}
