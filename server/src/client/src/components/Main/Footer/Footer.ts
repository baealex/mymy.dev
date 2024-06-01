import style from './Footer.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(style);

import { Component, html } from '~/modules/core';

export default class Footer extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('footer') });
    }

    render() {
        return html`
            <div>
                <i class="fas fa-link"></i> ${location.host}
            </div>
            <div>
                <i class="fas fa-code"></i> Created by <a href="https://baejino.com" target="_blank">Jino Bae</a>
            </div>
        `;
    }
}
