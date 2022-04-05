import style from './App.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

import Component from '../lib/component';
import Side from './Side';
import Main from './Main';
import Modal from './Modal';
export default class App extends Component {
    constructor($parent: HTMLElement) {
        super($parent);
        this.$el.id = 'root';
    }
    
    mount() {
        const $container = document.querySelector('.' + cx('container'));
        
        new Side($container as HTMLElement);
        new Main($container as HTMLElement);
        new Modal($container as HTMLElement);
    }

    render() {
        return `
            <div class="${cx('container')}"></div>
        `;
    }
}