import style from './Main.module.scss';
import classNames from 'classnames/bind';
const cn = classNames.bind(style);

import { Component, html } from '~/modules/core';
import Terminal from './Terminal';
import Footer from './Footer';
import Tools from './Tool';

import type { Lang } from '~/modules/code';
import { langs } from '~/modules/code';

import { langStore } from '~/stores/lang';
import { configureStore } from '~/stores/configure';
import { sourceStore } from '~/stores/source';

import CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/dart/dart';
import 'codemirror/mode/python/python';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/rust/rust';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint.css';
import { loadFromUrl } from '~/modules/data-on-url';
import { terminalStore } from '~/stores/terminal';

export default class Side extends Component {
    $textarea?: HTMLTextAreaElement;

    constructor($parent: HTMLElement) {
        super($parent, { className: cn('main') });
    }

    mount() {
        new Tools(this.$el);
        new Terminal(this.$el);
        new Footer(this.$el);

        this.$textarea = this.useSelector('textarea');

        const editor = (() => {
            const _editor = CodeMirror.fromTextArea(this.$textarea, {
                indentUnit: 4,
                autofocus: true,
                lineNumbers: true,
                matchBrackets: true,
                theme: 'material-darker'
            });

            let prevCurWord = '';

            _editor.on('keyup', (editor, event) => {
                const cursor = editor.getCursor();
                const token = editor.getTokenAt(cursor);
                const start = token.start;
                const end = cursor.ch;
                const curWord: string = token.string.slice(0, end - start);

                if (
                    event.key === 'ArrowLeft' ||
                    event.key === 'ArrowRight' ||
                    event.key === 'ArrowUp' ||
                    event.key === 'ArrowDown'
                ) {
                    return;
                }

                if (prevCurWord === curWord) {
                    return;
                }

                if (!curWord.match(/[a-zA-Z0-9_]/)) {
                    return;
                }

                if (curWord.trim().length > 0) {
                    CodeMirror.showHint(editor, () => {
                        const { list } = CodeMirror.hint.anyword(editor);

                        if (langStore.state.data === 'js') {
                            const obj = CodeMirror.hint.javascript(editor);
                            return {
                                ...obj,
                                list: [...list, ...obj.list]
                            };
                        }

                        return CodeMirror.hint.anyword(editor);
                    }, { completeSingle: false });
                }

                prevCurWord = curWord;
            });

            return Object.assign(_editor, {
                setEditorMode(lang: Lang) {
                    if (lang === 'c') {
                        _editor.setOption('mode', 'clike');
                        return;
                    }
                    if (lang === 'cpp') {
                        _editor.setOption('mode', 'clike');
                        return;
                    }
                    if (lang === 'dart') {
                        _editor.setOption('mode', 'javascript');
                        return;
                    }
                    if (lang === 'ts') {
                        _editor.setOption('mode', 'javascript');
                        return;
                    }
                    if (lang === 'js') {
                        _editor.setOption('mode', 'javascript');
                        return;
                    }
                    if (lang === 'py') {
                        _editor.setOption('mode', 'python');
                        return;
                    }
                    if (lang === 'rb') {
                        _editor.setOption('mode', 'ruby');
                        return;
                    }
                    if (lang === 'rs') {
                        _editor.setOption('mode', 'rust');
                        return;
                    }
                },
                $: this.useSelector('.CodeMirror')
            });
        })();

        editor.on('change', (editor) => {
            sourceStore.set((state) => ({
                ...state,
                files: {
                    ...state.files,
                    [state.activeFile]: editor.getValue()
                }
            }));
        });

        sourceStore.subscribe(({ activeFile, files }) => {
            if (files[activeFile] !== editor.getValue()) {
                editor.setValue(files[activeFile]);
            }
        });

        const dataLoadFromUrl = () => {
            const urlData = loadFromUrl() as {
                lang: Lang;
                source: string;
                terminal: string;
                fileName: string;
            } | null;

            if (urlData) {
                langStore.set(() => ({ data: urlData.lang }));
                sourceStore.set((state) => {
                    if (state.files[urlData.fileName] === urlData.source) {
                        return state;
                    }

                    if (state.files[urlData.fileName]) {
                        let fileName = urlData.fileName;
                        let i = 1;
                        while (state.files[fileName]) {
                            fileName = `${'copy_'.repeat(i++)}${urlData.fileName}`;
                        }
                        urlData.fileName = fileName;
                    }

                    return {
                        ...state,
                        activeFile: urlData.fileName,
                        files: {
                            ...state.files,
                            [urlData.fileName]: urlData.source
                        }
                    };
                });
                terminalStore.set(() => ({ data: urlData.terminal }));
                return;
            }
        };

        dataLoadFromUrl();
        window.addEventListener('hashchange', dataLoadFromUrl);

        langStore.subscribe(({ data }) => {
            editor.setEditorMode(data);
        }, { initialize: true });

        configureStore.subscribe((state) => {
            editor.$.style.fontSize = state.editorFontSize + 'px';
            editor.refresh();
        }, { initialize: true });

        if (sourceStore.state.activeFile) {
            editor.setValue(sourceStore.state.files[sourceStore.state.activeFile]);
            return;
        }

        langStore.set(() => ({ data: langs[Math.round(Math.random() * (langs.length - 1))] }));

        const source = sourceStore.createNewFile({ lang: langStore.state.data });
        editor.setValue(source);
    }

    render() {
        return html`
            <textarea></textarea>
        `;
    }
}
