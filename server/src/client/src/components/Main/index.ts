import style from './Main.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

import Component from '@lib/component';

import * as API from '@lib/api';
import { initCode, Lang, langs } from '@lib/code';
import { getParameter } from '@lib/query';

import { langStore } from '@stores/lang';
import { configureStore } from '@stores/configure';
import { sourceStore } from '@stores/source';
import { terminalStore } from '@stores/terminal';

import * as CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/rust/rust';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';

const runCode = (() => {
    let isRunning = false;

    return () => {
        if (!isRunning) {
            isRunning = true;
            terminalStore.set(() => ({ data: 'Running...' }));
            API.getSourceResult(
                langStore.state.data,
                sourceStore.state.data
            ).then(({ data }) => {
                terminalStore.set(() => ({ data }));
            }).catch(() => {
                terminalStore.set(() => ({ data: 'Error!' }));
            }).finally(() => {
                isRunning = false;
            });
        }
    };
})();

export default class Side extends Component {
    constructor($parent: HTMLElement) {
        super($parent, { className: cx('main') });
    }

    mount() {
        window.addEventListener('keydown', (e) => {
            if (e.key === configureStore.state.runShortcut) {
                e.preventDefault();
                runCode();
            }
        });

        const $textarea = this.$el.querySelector('textarea') as HTMLTextAreaElement;
        const editor = (() => {
            const _editor = CodeMirror.fromTextArea($textarea, {
                lineNumbers: true,
                indentUnit: 4,
                theme: 'material-darker',
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
                    if (lang === 'js') {
                        _editor.setOption('mode', 'javascript');
                        return;
                    }
                    if (lang === 'ts') {
                        _editor.setOption('mode', 'javascript');
                        return;
                    }
                    if (lang === 'py') {
                        _editor.setOption('mode', 'python');
                        return;
                    }
                    if (lang === 'rs') {
                        _editor.setOption('mode', 'rust');
                        return;
                    }
                },
                $: this.$el.querySelector('.CodeMirror') as HTMLElement,
            });
        })();
        editor.on('change', (editor) => {
            sourceStore.set(() => ({ data: editor.getValue() }));
        });
        langStore.subscribe(({ data }) => {
            editor.setEditorMode(data);
        });
        
        const $select = this.$el.querySelector('select') as HTMLSelectElement;
        $select.addEventListener('change', (e: any) => {
            langStore.set(() => ({ data: e.target.value as Lang}));
        });
        langStore.subscribe(({ data }) => {
            $select.selectedIndex = langs.findIndex((name) => {
                return name === data;
            });
        });

        const $button = this.$el.querySelector('button') as HTMLElement;
        $button.addEventListener('click', runCode);

        const $terminal = this.$el.querySelector(`.${cx('terminal')}`) as HTMLElement;
        terminalStore.subscribe(({ data }) => {
            $terminal.textContent = data;
        });

        configureStore.subscribe((state) => {
            $terminal.style.fontSize = state.terminalFontSize + 'px';
            $terminal.style.fontFamily = state.terminalFontFamily;
            editor.$.style.fontSize = state.editorFontSize + 'px';
            editor.refresh();
        });

        const raw = decodeURIComponent(getParameter('raw'));

        if (raw && raw.startsWith('/')) {
            const [ name ] = raw.split('/').slice(-1);
            const [ lang ] = name.split('.').slice(-1) as Lang[];
            let isSupported = false;

            if (
                lang === 'c' ||
                lang === 'cpp' ||
                lang === 'js' ||
                lang === 'ts' ||
                lang === 'py' ||
                lang === 'rs'
            ) {
                isSupported = true;
                langStore.set(() => ({ data: lang }));
            }

            API.getRawSource(raw).then(({ data }) => {
                editor.setValue(data);
                if (!isSupported) {
                    alert('This is unsupported language 😿');
                }
            });
            return;
        }

        if (sourceStore.state.data !== '') {
            editor.setValue(sourceStore.state.data);
            return;
        }

        langStore.set(() => ({
            data: langs[Math.round(Math.random() * (langs.length - 1))],
        }));
        editor.setValue(initCode[langStore.state.data]);
    }
    render() {
        return `
            <textarea></textarea>
            <div class="${cx('tools')}">
                <select>
                    <option selected value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="rs">Rust</option>
                    <option value="js">JavaScript</option>
                    <option value="ts">TypeScript</option>
                    <option value="py">Python3</option>
                </select>
                <button>Run</button>
            </div>
            <div class="${cx('terminal')}"></div>
            <div class="${cx('footer')}">
                <div class="${cx('url')}">
                    <i class="fas fa-link"></i> mymy.dev
                </div>
                <div>
                    Copyright 2022 Jino Bae
                </div>
            </div>
        `;
    }
}