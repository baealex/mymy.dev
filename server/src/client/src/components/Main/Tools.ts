import style from './Tools.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import Component from '~/modules/component'

import socket from '~/modules/socket'
import { Lang, langs } from '~/modules/code'

import { configureStore } from '~/stores/configure'
import { langStore } from '~/stores/lang'
import { terminalStore } from '~/stores/terminal'
import { sourceStore } from '~/stores/source'

import {
    SOCKET_EVENT_NAME,
    CodeRunnerEventParams,
    CodeRunnerResultEventParams,
} from '../../../../socket-event'

const runCode = (() => {
    let isRunning = false

    socket.on(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, ({ data }: CodeRunnerResultEventParams) => {
        terminalStore.set(() => ({ data }))
        isRunning = false
    })

    socket.on(SOCKET_EVENT_NAME.CODE_RUNNER_ERROR, () => {
        terminalStore.set(() => ({ data: 'Error!' }))
        isRunning = false
    })

    return () => {
        if (!isRunning) {
            isRunning = true
            terminalStore.set(() => ({ data: 'Running...' }))

            socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER, CodeRunnerEventParams({
                language: langStore.state.data,
                source: sourceStore.state.files[sourceStore.state.activeFile]
            }))
        }
    }
})()

export default class Tools extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('tools') })
    }

    mount() {
        window.addEventListener('keydown', (e) => {
            if (e.key === configureStore.state.runShortcut) {
                e.preventDefault()
                runCode()
            }
        })

        const $select = this.$el.querySelector('select') as HTMLSelectElement
        
        $select.addEventListener('change', (e: any) => {
            langStore.set(() => ({ data: e.target.value as Lang}))
        })

        langStore.subscribe(({ data }) => {
            $select.selectedIndex = langs.findIndex((name) => {
                return name === data
            })
        }, { initialize: true })

        sourceStore.subscribe(({ activeFile }) => {
            const lang = activeFile.split('.').slice(-1)[0] as Lang
            if (langs.includes(lang)) {
                langStore.set({ data: lang})
            }
        }, { initialize: true })
    
        const $button = this.$el.querySelector('button') as HTMLElement
        $button.addEventListener('click', runCode)
    }

    render() {
        return `
            <select>
                <option selected value="c">C</option>
                <option value="cpp">C++</option>
                <option value="rs">Rust</option>
                <option value="js">JavaScript</option>
                <option value="ts">TypeScript</option>
                <option value="py">Python3</option>
            </select>
            <button>Run</button>
        `
    }
}
