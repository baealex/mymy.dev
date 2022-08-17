import style from './FileManager.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import Component from '@lib/component'

import { sourceStore } from '@stores/source'
import { configureStore } from '@stores/configure'

let hasFocusedFileList = false

export default class FileManager extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('files') })
    }

    mount() {
        configureStore.subscribe(({ visibleFileManager }) => {
            if (visibleFileManager) {
                this.$el.style.width = '250px'
            } else {
                this.$el.style.width = '0px'
            }
        }, { initialize: true })
        
        const $fileList = this.$el.querySelector('ul') as HTMLUListElement

        document.addEventListener('click', e => {
            const { left, width, top, height } = $fileList.getBoundingClientRect()

            if (
                e.clientX > left && e.clientX < left + width &&
                e.clientY > top  && e.clientY < top + height
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
                    const $active = $fileList.querySelector(`.${cn('active')}`) as HTMLDListElement
                    $active.innerHTML = `<input id="rename" type="text" value="${sourceStore.state.activeFile}">`
  
                    const $rename = document.getElementById('rename') as HTMLInputElement
                    $rename?.focus()
                    const endSelection = $rename.value.lastIndexOf('.')
                    $rename.setSelectionRange(0, endSelection)
                    $rename.addEventListener('keydown', (e: any) => {
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
                <li data-name="${file}" class="${cn(file === state.activeFile && 'active')}">
                    ${file}
                </li>
            `).join('')
        }, { initialize: true })

        const $fileAction = this.$el.querySelector(`.${cn('files')} .${cn('action')}`) as HTMLDivElement

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
            <div class="${cn('top')}">
                <span>FILES</span>
                <div class="${cn('action')}">
                    <i data-type="create" class="fas fa-file-code"></i>
                </div>
            </div>
            <ul></ul>
        `
    }
}
