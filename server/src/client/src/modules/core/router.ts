import type Component from './component';

const routerInstance = (() => {
    let _instance: Router = null;

    return {
        get() {
            return _instance;
        },
        set(instance: Router) {
            _instance = instance;
        }
    };
})();

export const useRouter = () => {
    return routerInstance.get();
};

export class Router {
    $root: HTMLElement;
    pageMemory: Component;
    componentMap: Map<string, typeof Component>;

    constructor($root: HTMLElement) {
        const router = routerInstance.get();
        if (router) return router;

        window.addEventListener('popstate', () => {
            this.push(window.location.pathname, true);
        });
        this.$root = $root;
        this.componentMap = new Map();
        routerInstance.set(this);
    }

    routes(path: string, component: unknown) {
        this.componentMap.set(path, component as typeof Component);
        return this;
    }

    push(path: string, isPopState = false) {
        if (this.componentMap.has(path)) {
            if (window.location.pathname === path && !isPopState) {
                return;
            }

            if (!isPopState) {
                window.history.pushState({}, '', path);
            }

            if (this.pageMemory) {
                this.pageMemory.unmount();
            }

            const component = this.componentMap.get(path);
            this.$root.innerHTML = '';
            this.pageMemory = new component(this.$root);
        }
    }
}
