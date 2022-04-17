import Store from 'badland';

export function iRemember<T>(key: string, store: Store<T>) {
    if ('localStorage' in window) {
        const value = localStorage.getItem(key);
    
        if (value) {
            store.set((prevState) => ({
                ...prevState,
                ...JSON.parse(value),
            }));
        }
    
        store.subscribe((state) => {
            localStorage.setItem(key, JSON.stringify(state));
        });
    }
}