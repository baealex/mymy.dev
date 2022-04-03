export class Component {
    $el: HTMLDivElement;
    isMounted: boolean;

    constructor($parent: HTMLElement) {
        this.$el = document.createElement('div');
        $parent.appendChild(this.$el);
        this.rerender();
        this.isMounted = true;
    }

    rerender() {
        if (this.isMounted) {
            this.unmount();
        }
        this.$el.innerHTML = this.render();
        this.mount();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mount() {

    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unmount() {
        
    }

    render() {
        return '';
    }
}