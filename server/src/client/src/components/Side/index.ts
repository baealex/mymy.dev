import style from './Side.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(style)

import Component from '@lib/component'

import { modalStore } from '@stores/modal'
import { sourceStore } from '@stores/source'
import { configureStore } from '@stores/configure'

let hasFocusedFileList = false

export default class Side extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cx('side') })
    }

    mount() {
        const $icons = this.$el.querySelectorAll(
            `.${cx('icons')} .${cx('top')} > div,` +
            `.${cx('icons')} .${cx('bottom')} > div`
        )
        for (const $icon of $icons) {
            $icon.addEventListener('click', (e: any) => {
                const modalName = e.currentTarget.dataset['on']
                modalStore.set((prevState) => {
                    const nextState = Object.keys(prevState).reduce((acc, key) => ({
                        ...acc,
                        [key]: false,
                    }), {})
                    return {
                        ...nextState,
                        [modalName]: true,
                    }
                })
            })
        }

        const $fileList = this.$el.querySelector(`.${cx('files')} > ul`) as HTMLUListElement

        document.addEventListener('click', e => {
            if (
                e.clientX > $fileList.clientLeft &&
                e.clientX < $fileList.clientLeft + $fileList.clientWidth &&
                e.clientY > $fileList.clientTop &&
                e.clientY < $fileList.clientTop + $fileList.clientHeight
            ) {
                hasFocusedFileList = true
            } else {
                hasFocusedFileList = false
            }
        })

        $fileList.addEventListener('click', (e: any) => {
            hasFocusedFileList = true
            
            const fileName = e.target.dataset['name']
            if (fileName) {
                sourceStore.set((state) => ({
                    ...state,
                    activeFile: fileName,
                }))
            }
        })

        window.addEventListener('keydown', (e) => {
            if (hasFocusedFileList) {
                if (e.key === configureStore.state.activeFileDeleteShortcut) {
                    sourceStore.removeActiveFile()
                }
                if (e.key === configureStore.state.activeFileRenameShortcut) {
                    const $active = $fileList.querySelector(`.${cx('active')}`) as HTMLDListElement
                    $active.innerHTML = `<input id="rename" type="text" value="${sourceStore.state.activeFile}">`
    
                    const $rename = document.getElementById('rename') as HTMLInputElement
                    $rename?.focus()
                    const endSelection = $rename.value.lastIndexOf('.')
                    $rename.setSelectionRange(0, endSelection)
                    $rename.addEventListener('keydown', (e: any) => {
                        console.log(e.key)
                        if (e.key === 'Escape') {
                            sourceStore.set({})
                        }
                        if (e.key === 'Enter') {
                            sourceStore.renameActiveFile(e.target.value)
                        }
                    })
                }
            }
        })

        sourceStore.subscribe((state) => {
            $fileList.innerHTML = Object.keys(state.files).map((file) => `
                <li data-name="${file}" class="${cx(file === state.activeFile && 'active')}">
                    ${file}
                <li>
            `).join('')
        }, { initialize: true })

        const $fileAction = this.$el.querySelector(`.${cx('files')} .${cx('action')}`) as HTMLDivElement

        $fileAction.addEventListener('click', (e: any) => {
            const actionType = e.target.dataset['type']
            if (actionType) {
                if (actionType === 'create') {
                    sourceStore.createNewFile()
                }
            }
        })
    }

    render() {
        return `
            <div class="${cx('icons')}">
                <div class="${cx('top')}">
                    <div data-on="github">
                        <i class="fab fa-github"></i>
                    </div>
                </div>
                <div class="${cx('bottom')}">
                    <div data-on="setting">
                        <i class="fas fa-cog"></i>
                    </div>
                </div>
            </div>
            <div class="${cx('files')}">
                <div class="${cx('top')}">
                    <span>FILES</span>
                    <div class="${cx('action')}">
                        <i data-type="create" class="fas fa-file-code"></i>
                    </div>
                </div>
                <ul></ul>
            </div>
        `
    }
}
