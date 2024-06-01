interface ComponentProps<T> {
    id?: string;
    tag?: keyof HTMLElementTagNameMap;
    className?: string;
    initialState?: T;
}

export default class Component<T extends HTMLElement = HTMLDivElement, K = unknown> {
    $el: T;
    _state: K;
    _isMounted = false;

    constructor($parent: HTMLElement, props?: ComponentProps<K>) {
        this.$el = document.createElement(props?.tag || 'div') as T;

        if (props?.id) {
            this.$el.id = props.id;
        }

        if (props?.className) {
            this.$el.className = props.className;
        }

        $parent.appendChild(this.$el);
        this._state = props?.initialState as K;
        this.rerender();
    }

    get state() {
        return { ...this._state };
    }

    useSelector<T extends HTMLElement>(selector: string): T {
        return this.$el.querySelector(selector) as T;
    }

    rerender() {
        window.requestAnimationFrame(() => {
            if (this._isMounted) {
                this.unmount();
            } else {
                this._isMounted = true;
            }
            this.$el.innerHTML = this.render();
            this.mount();
        });
    }

    setState(nextState: K | ((prevState: K) => K)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let newState: any = nextState;

        if (typeof newState === 'function') {
            newState = newState(this.state);
        }

        newState = Object.freeze({
            ...this._state,
            ...newState
        });

        this._state = newState;

        if (this._isMounted) {
            this.rerender();
        }
    }

    mount() {

    }

    unmount() {

    }

    render() {
        return '';
    }
}
