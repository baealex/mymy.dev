import style from './Terminal.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(style);

import { Component } from '~/modules/core';
import { terminalStore } from '~/stores/terminal';
import { configureStore } from '~/stores/configure';

export default class Terminal extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('terminal') });
    }

    mount() {
        terminalStore.subscribe(({ data }) => {
            this.$el.textContent = data;
        }, { initialize: true });

        configureStore.subscribe((state) => {
            this.$el.style.fontSize = state.terminalFontSize + 'px';
            this.$el.style.fontFamily = state.terminalFontFamily;
        }, { initialize: true });
    }
}
