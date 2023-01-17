import style from './App.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import { Component, html } from '~/modules/core'

import Side from '../Side/Side'
import Main from '../Main/Main'
import Modal from '../Modal/Modal'

export default class App extends Component {
    $container?: HTMLDivElement

    constructor($parent: HTMLElement) {
        super($parent, { id: 'root' })
    }

    mount() {
        this.$container = this.useSelector(`.${cn('container')}`)

        new Side(this.$container)
        new Main(this.$container)
        new Modal(this.$container)
    }

    render() {
        return html`
            <div class="${cn('container')}"></div>
        `
    }
}
