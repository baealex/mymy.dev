import style from './Footer.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(style)

import Component from '@lib/component'

export default class Footer extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cx('footer') })
    }

    render() {
        return `
            <div>
                <i class="fas fa-link"></i> mymy.dev
            </div>
            <div>
                Copyright 2022 Jino Bae
            </div>
        `
    }
}
