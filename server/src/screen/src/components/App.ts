import style from './App.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

import * as API from '../lib/api';
import { initCode, Lang, langs } from '../lib/code';
import { Component } from '../lib/component';
import { getParameter } from '../lib/query';

import { configureStore } from '../store/configure';
import { langStore } from '../store/lang';
import { modalStore } from '../store/modal';
import { sourceStore } from '../store/source';
import { terminalStore } from '../store/terminal';

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

export class App extends Component {
    constructor($parent: HTMLElement) {
        super($parent);
        this.$el.id = 'root';
    }
    
    mount() {
        const $textarea = document.querySelector(`.${cx('container')} textarea`) as HTMLTextAreaElement;
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
                    if (lang === 'py') {
                        _editor.setOption('mode', 'python');
                        return;
                    }
                    if (lang === 'rs') {
                        _editor.setOption('mode', 'rust');
                        return;
                    }
                }
            });
        })();
        editor.on('change', (editor) => {
            sourceStore.set(() => ({ data: editor.getValue() }));
        });
        langStore.subscribe(({ data }) => {
            editor.setEditorMode(data);
        });

        const $terminal = document.querySelector(`.${cx('terminal')}`) as HTMLDivElement;
        terminalStore.subscribe(({ data }) => {
            $terminal.textContent = data;
        });
        
        const $select = document.querySelector(`.${cx('container')} select`) as HTMLSelectElement;
        $select.addEventListener('change', (e: any) => {
            langStore.set(() => ({ data: e.target.value as Lang}));
        });
        langStore.subscribe(({ data }) => {
            $select.selectedIndex = langs.findIndex((name) => {
                return name === data;
            });
        });

        const $button = document.querySelector(`.${cx('container')} button`) as HTMLButtonElement;
        $button.addEventListener('click', runCode);

        window.addEventListener('keydown', (e) => {
            if (e.key === configureStore.state.runShortcut) {
                e.preventDefault();
                runCode();
            }
        });

        const $icons = document.querySelectorAll(
            `.${cx('icons')} .${cx('top')} > div,` +
            `.${cx('icons')} .${cx('bottom')} > div`
        );
        for (const $icon of $icons) {
            $icon.addEventListener('click', (e: any) => {
                const modalName = e.currentTarget.dataset['on'];
                modalStore.set((prevState) => {
                    Object.keys(prevState).forEach((key) => {
                        prevState[key as keyof typeof prevState] = false;
                    });
                    return {
                        ...prevState,
                        [modalName]: true,
                    };
                });
            });
        }

        const $modal = {
            github: document.querySelector('.github.modal'),
            setting: document.querySelector('.setting.modal'),
        };
        Object.keys($modal).forEach(_key => {
            const key = _key as keyof typeof $modal;
            $modal[key]?.querySelector('.close')?.addEventListener('click', () => {
                modalStore.set((prevState) => ({
                    ...prevState,
                    [key]: false,
                }));
            });
        });
        modalStore.subscribe((state) => {
            Object.keys(state).forEach(_key => {
                const key = _key as keyof typeof state;
                state[key]
                    ? $modal[key]?.classList.remove('hidden')
                    : $modal[key]?.classList.add('hidden');
            });
        });

        const raw = getParameter('raw');

        if (raw) {
            const [ name ] = decodeURIComponent(raw).split('/').slice(-1);
            const [ lang ] = name.split('.').slice(-1) as Lang[];

            langStore.set(() => ({ data: lang }));

            API.getRawSource(raw).then(({ data }) => {
                editor.setValue(data);
            });
        } else {
            langStore.set(() => ({
                data: langs[Math.round(Math.random() * (langs.length - 1))],
            }));
            editor.setValue(initCode[langStore.state.data]);
        }
    }

    render() {
        return `
            <div class="${cx('container')}">
                <div class="${cx('side')}">
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
                </div>
                <div class="${cx('main')}">
                    <textarea></textarea>
                    <div class="${cx('tools')}">
                        <select>
                            <option selected value="c">C</option>
                            <option value="cpp">C++</option>
                            <option value="rs">Rust</option>
                            <option value="js">JavaScript</option>
                            <option value="py">Python3</option>
                        </select>
                        <button>
                            Run
                        </button>
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
                </div>
            </div>
            <div class="github modal hidden">
                <div class="header">
                    <div class="title">
                        <i class="fab fa-github"></i> GitHub
                    </div>
                    <div class="close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div class="content">
                    😅 준비중 입니다.
                </div>
            </div>
            <div class="setting modal hidden">
                <div class="header">
                    <div class="title">
                        <i class="fas fa-cog"></i> Setting
                    </div>
                    <div class="close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div class="content">
                    😅 준비중 입니다.
                </div>
            </div>
        `;
    }
}