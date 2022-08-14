import style from './Side.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(style)

import Component from '@lib/component'
import Functions from './Functions'
import FileManagement from './FileManagement'

export default class Side extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cx('side') })
    }

    mount() {
        new Functions(this.$el)
        new FileManagement(this.$el)
    }

    render() {
        return ''
    }
}
