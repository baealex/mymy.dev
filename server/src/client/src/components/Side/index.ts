import style from './Side.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import { Component, html } from '~/modules/core'
import Functions from './Functions'
import FileManager from './FileManager'

export default class Side extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('side') })
    }

    mount() {
        new Functions(this.$el)
        new FileManager(this.$el)
    }

    render() {
        return ''
    }
}
