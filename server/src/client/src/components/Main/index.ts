import style from './Main.module.scss'
import classNames from 'classnames/bind'
const cn = classNames.bind(style)

import Component from '@lib/component'
import Terminal from './Terminal'
import Footer from './Footer'
import Tools from './Tools'

import { Lang, langs } from '@lib/code'

import { langStore } from '@stores/lang'
import { configureStore } from '@stores/configure'
import { sourceStore } from '@stores/source'

import * as CodeMirror from 'codemirror'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/rust/rust'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'

export default class Side extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cn('main') })
    }

    mount() {
        new Tools(this.$el)
        new Terminal(this.$el)
        new Footer(this.$el)

        const $textarea = this.$el.querySelector('textarea') as HTMLTextAreaElement
        const editor = (() => {
            const _editor = CodeMirror.fromTextArea($textarea, {
                lineNumbers: true,
                indentUnit: 4,
                theme: 'material-darker',
            })

            return Object.assign(_editor, {
                setEditorMode(lang: Lang) {
                    if (lang === 'c') {
                        _editor.setOption('mode', 'clike')
                        return
                    }
                    if (lang === 'cpp') {
                        _editor.setOption('mode', 'clike')
                        return
                    }
                    if (lang === 'js') {
                        _editor.setOption('mode', 'javascript')
                        return
                    }
                    if (lang === 'ts') {
                        _editor.setOption('mode', 'javascript')
                        return
                    }
                    if (lang === 'py') {
                        _editor.setOption('mode', 'python')
                        return
                    }
                    if (lang === 'rs') {
                        _editor.setOption('mode', 'rust')
                        return
                    }
                },
                $: this.$el.querySelector('.CodeMirror') as HTMLElement,
            })
        })()

        editor.on('change', (editor) => {
            sourceStore.set((state) => ({
                ...state,
                files: {
                    ...state.files,
                    [state.activeFile]: editor.getValue(),
                }
            }))
        })

        sourceStore.subscribe(({ activeFile, files }) => {
            if (files[activeFile] !== editor.getValue()) {
                editor.setValue(files[activeFile])
            }
        })
        
        langStore.subscribe(({ data }) => {
            editor.setEditorMode(data)
        }, { initialize: true })
        
        configureStore.subscribe((state) => {
            editor.$.style.fontSize = state.editorFontSize + 'px'
            editor.refresh()
        }, { initialize: true })

        if (sourceStore.state.activeFile) {
            editor.setValue(sourceStore.state.files[sourceStore.state.activeFile])
            return
        }

        langStore.set(() => ({
            data: langs[Math.round(Math.random() * (langs.length - 1))],
        }))

        const source = sourceStore.createNewFile({
            lang: langStore.state.data,
        })
        editor.setValue(source)
    }

    render() {
        return `
            <textarea></textarea>
        `
    }
}
