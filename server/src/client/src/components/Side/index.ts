import style from './Side.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(style)

import Component from '@lib/component'
import Functions from './Functions'
import FileManager from './FileManager'

export default class Side extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cx('side') })
    }

    mount() {
        new Functions(this.$el)
        new FileManager(this.$el)
    }

    render() {
        return ''
    }
}
