import style from './Footer.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import { Component, html } from '~/modules/core'

export default class Footer extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('footer') })
    }

    render() {
        return html`
            <div>
                <i class="fas fa-link"></i> ${location.host}
            </div>
            <div>
                Copyright 2022 Jino Bae
            </div>
        `
    }
}