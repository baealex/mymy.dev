import style from './Side.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(style)

import Component from '@lib/component'

import { modalStore } from '@stores/modal'

export default class Side extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cx('side') })
    }

    mount() {
        const $icons = document.querySelectorAll(
            `.${cx('icons')} .${cx('top')} > div,` +
            `.${cx('icons')} .${cx('bottom')} > div`
        )
        for (const $icon of $icons) {
            $icon.addEventListener('click', (e: any) => {
                const modalName = e.currentTarget.dataset['on']
                modalStore.set((prevState) => {
                    const nextState = Object.keys(prevState).reduce((acc, key) => ({
                        ...acc,
                        [key]: false,
                    }), {})
                    return {
                        ...nextState,
                        [modalName]: true,
                    }
                })
            })
        }
    }

    render() {
        return `
            <div class="${cx('icons')}">
                <div class="${cx('top')}">
                    <div data-on="github">
                        <i class="fab fa-github"></i>
                    </div>
                </div>
                <div class="${cx('bottom')}">
                    <div data-on="setting">
                        <i class="fas fa-cog"></i>
                    </div>
                </div>
            </div>
        `
    }
}
