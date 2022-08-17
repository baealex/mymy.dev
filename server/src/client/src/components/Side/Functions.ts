import style from './Functions.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import Component from '@lib/component'

import { modalStore } from '@stores/modal'
import { configureStore } from '@stores/configure'

export default class Functions extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('functions') })
    }

    mount() {
        const $icons = this.$el.querySelectorAll(
            `.${cn('top')} > div,` +
            `.${cn('bottom')} > div` 
        )
        for (const $icon of $icons) {
            $icon.addEventListener('click', (e: any) => {
                const eventName = e.currentTarget.dataset['on']

                if (eventName === 'modal') {
                    const modalName = e.currentTarget.dataset[eventName]
                    modalStore.set((prevState: any) => {
                        const nextState = Object.keys(prevState).reduce((acc, key) => ({
                            ...acc,
                            [key]: false,
                        }), {})
                        
                        return {
                            ...nextState,
                            [modalName]: !prevState[modalName],
                        }
                    })
                }

                if (eventName === 'file') {
                    configureStore.set((state) => ({
                        ...state,
                        visibleFileManager: !state.visibleFileManager,
                    }))
                }
            })
        }
    }

    render() {
        return `
            <div class="${cn('top')}">
                <div data-on="file">
                    <i class="fas fa-copy"></i>
                </div>
                <div data-on="modal" data-modal="github">
                    <i class="fab fa-github"></i>
                </div>
            </div>
            <div class="${cn('bottom')}">
                <div data-on="modal" data-modal="setting">
                    <i class="fas fa-cog"></i>
                </div>
            </div>
      `
    }
}
