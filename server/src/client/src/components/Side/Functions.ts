import style from './Functions.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(style)

import Component from '@lib/component'

import { modalStore } from '@stores/modal'
import { configureStore } from '@stores/configure'

export default class Functions extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cx('functions') })
    }

    mount() {
        const $icons = this.$el.querySelectorAll(
            `.${cx('top')} > div,` +
            `.${cx('bottom')} > div` 
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
            <div class="${cx('top')}">
                <div data-on="file">
                    <i class="fas fa-copy"></i>
                </div>
                <div data-on="modal" data-modal="github">
                    <i class="fab fa-github"></i>
                </div>
            </div>
            <div class="${cx('bottom')}">
                <div data-on="modal" data-modal="setting">
                    <i class="fas fa-cog"></i>
                </div>
            </div>
      `
    }
}
