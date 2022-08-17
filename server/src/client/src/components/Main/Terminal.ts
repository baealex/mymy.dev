import style from './Terminal.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import Component from '@lib/component'
import { terminalStore } from '@stores/terminal'
import { configureStore } from '@stores/configure'

export default class Terminal extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('terminal') })
    }

    mount() {
        const $terminal = this.$el
        
        terminalStore.subscribe(({ data }) => {
            $terminal.textContent = data
        }, { initialize: true })

        configureStore.subscribe((state) => {
            $terminal.style.fontSize = state.terminalFontSize + 'px'
            $terminal.style.fontFamily = state.terminalFontFamily
        }, { initialize: true })
    }
} 
