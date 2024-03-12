import style from './FileManager.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import { Component, html } from '~/modules/core'

import { sourceStore } from '~/stores/source'
import { configureStore } from '~/stores/configure'
import { contextMenu } from '~/modules/context-menu'
import { initCode } from '~/modules/code'

let hasFocusedFileList = false

export default class FileManager extends Component {
    $fileList: HTMLUListElement

    constructor($parent: HTMLElement) {
        super($parent, { className: cn('files') })
        this.$fileList = this.$el.querySelector('ul')!
    }

    mount() {
        this.$fileList = this.$el.querySelector('ul')!

        configureStore.subscribe(({ visibleFileManager }) => {
            if (visibleFileManager) {
                this.$el.style.width = '250px'
            } else {
                this.$el.style.width = '0px'
            }
        }, { initialize: true })

        const changeElementActiveFileForRename = () => {
            const $active = this.$fileList.querySelector(`.${cn('active')}`) as HTMLDListElement
            $active.innerHTML = `<input id="rename" type="text" value="${sourceStore.state.activeFile}">`

            const $rename = document.getElementById('rename') as HTMLInputElement
            $rename?.focus()
            const endSelection = $rename.value.lastIndexOf('.')
            $rename.setSelectionRange(0, endSelection)
            $rename.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    sourceStore.set({})
                }
                if (e.key === 'Enter') {
                    sourceStore.renameActiveFile((e.target as HTMLInputElement).value)
                }
            })
        }

        document.addEventListener('click', (e) => {
            const { left, width, top, height } = this.$fileList.getBoundingClientRect()

            if (
                e.clientX > left && e.clientX < left + width &&
                e.clientY > top && e.clientY < top + height
            ) {
                hasFocusedFileList = true
            } else {
                hasFocusedFileList = false
            }
        })

        this.$fileList.addEventListener('click', (e) => {
            hasFocusedFileList = true

            const fileName = (e.target as HTMLElement).dataset['name']
            if (fileName) {
                sourceStore.set((state) => ({
                    ...state,
                    activeFile: fileName,
                }))
            }
        })

        this.$el.addEventListener('contextmenu', async (e) => {
            const fileName = (e.target as HTMLElement).dataset['name']
            if (fileName) {
                await sourceStore.set((state) => ({
                    ...state,
                    activeFile: fileName,
                }))
                contextMenu.create({
                    top: e.clientY + window.scrollY,
                    left: e.clientX + window.scrollX,
                    menus: [
                        {
                            label: `Rename (${configureStore.state.activeFileRenameShortcut})`,
                            click: changeElementActiveFileForRename
                        },
                        {
                            label: `Delete (${configureStore.state.activeFileDeleteShortcut})`,
                            click: sourceStore.removeActiveFile.bind(sourceStore)
                        }
                    ]
                })
            } else {
                contextMenu.create({
                    top: e.clientY + window.scrollY,
                    left: e.clientX + window.scrollX,
                    menus: [
                        {
                            label: 'Create File',
                            subMenus: [
                                {
                                    label: 'C',
                                    click: () => sourceStore.createNewFile({
                                        lang: 'c',
                                        fileData: initCode['c']
                                    })
                                },
                                {
                                    label: 'C++',
                                    click: () => sourceStore.createNewFile({
                                        lang: 'cpp',
                                        fileData: initCode['cpp']
                                    })
                                },
                                {
                                    label: 'Rust',
                                    click: () => sourceStore.createNewFile({
                                        lang: 'rs',
                                        fileData: initCode['rs']
                                    })
                                },
                                {
                                    label: 'JavaScript',
                                    click: () => sourceStore.createNewFile({
                                        lang: 'js',
                                        fileData: initCode['js']
                                    })
                                },
                                {
                                    label: 'Python',
                                    click: () => sourceStore.createNewFile({
                                        lang: 'py',
                                        fileData: initCode['py']
                                    })
                                },
                                {
                                    label: 'Empty',
                                    click: () => sourceStore.createNewFile()
                                },
                            ]
                        },
                    ]
                })
            }
        })

        window.addEventListener('keydown', (e) => {
            if (hasFocusedFileList) {
                if (e.key === configureStore.state.activeFileDeleteShortcut) {
                    sourceStore.removeActiveFile()
                }
                if (e.key === configureStore.state.activeFileRenameShortcut) {
                    changeElementActiveFileForRename()
                }
            }
        })

        sourceStore.subscribe((state) => {
            this.$fileList.innerHTML = Object.keys(state.files).map((file) => `
                <li data-name="${file}" class="${cn(file === state.activeFile && 'active')}">
                    ${file}
                </li>
            `).join('')
        }, { initialize: true })

        const $fileAction = this.$el.querySelector(`.${cn('files')} .${cn('action')}`) as HTMLDivElement

        $fileAction.addEventListener('click', (e) => {
            const actionType = (e.target as HTMLElement).dataset['type']
            if (actionType) {
                if (actionType === 'create') {
                    sourceStore.createNewFile()
                }
            }
        })
    }

    render() {
        return html`
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
