interface ComponentProps {
  id?: string;
  className?: string;
}

export class Component {
    $el: HTMLDivElement
    _isMounted: boolean

    constructor($parent: HTMLElement, props?: ComponentProps) {
        this.$el = document.createElement('div')

        if (props?.id) {
            this.$el.id = props.id
        }

        if (props?.className) {
            this.$el.className = props.className
        }
      
        $parent.appendChild(this.$el)
        this.rerender()
        this._isMounted = true
    }

    useSelector<T extends HTMLElement>(selector: string): T {
        return this.$el.querySelector(selector) as T
    }

    rerender() {
        if (this._isMounted) {
            this.unmount()
        }
        this.$el.innerHTML = this.render()
        this.mount()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mount() {

    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    unmount() {
      
    }

    render() {
        return ''
    }
}
