export function createStore<T>(initialState: T) {
    let state = initialState;
    let observers: {
        key: string;
        fn: (state: T) => void;
    }[] = [];

    return {
        get state() {
            return {...state};
        },
        unsubscribe(removeKey: string) {
            observers = observers.filter(({ key }) => key !== removeKey);
        },
        subscribe(fn: (state: T) => void): string {
            const key = '' + Math.random();
            observers.push({ key, fn });
            return key;
        },
        set(next: (prevState: T) => T) {
            state = next(state);
            observers.forEach(({ fn }) => fn(state));
        }
    }
}