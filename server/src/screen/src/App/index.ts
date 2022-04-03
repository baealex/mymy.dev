import style from './App.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

import axios from 'axios';
import { initCode, Lang, langs } from '../lib/init-code';

import { langStore } from '../store/lang';
import { sourceStore } from '../store/source';
import { terminalStore } from '../store/terminal';

import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material-darker.css';
import 'codemirror/addon/hint/show-hint';

function getParameter(name: string) {
    const [ result ] = location.search
        .substr(1)
        .split('&')
        .filter(item => item.split('=')[0] === name)
        .map(item => decodeURIComponent(item.split('=')[1]));
    return result;
}

export function App($app: HTMLElement) {
    $app.innerHTML = `
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
    `;

    const $textarea = document.querySelector(`.${cx('container')} textarea`) as HTMLTextAreaElement;
    const editor = CodeMirror.fromTextArea($textarea, {
        lineNumbers: true,
        theme: 'material-darker',
    });

    const setEditorMode = (lang: Lang) => {
        if (lang === 'c') {
            editor.setOption('mode', 'clike');
            return;
        }
        if (lang === 'cpp') {
            editor.setOption('mode', 'clike');
            return;
        }
        if (lang === 'js') {
            editor.setOption('mode', 'javascript');
            return;
        }
        if (lang === 'py') {
            editor.setOption('mode', 'python');
            return;
        }
        if (lang === 'rs') {
            editor.setOption('mode', 'rust');
            return;
        }
    }

    langStore.subscribe(({ data }) => {
        setEditorMode(data);
        $select.selectedIndex = langs.findIndex((name) => {
            return name === data;
        });
    });

    editor.on('change', (editor) => {
        sourceStore.set(() => ({ data: editor.getValue() }));
    })

    const $terminal = document.querySelector(`.${cx('terminal')}`) as HTMLDivElement;
    terminalStore.subscribe(({ data }) => {
        $terminal.textContent = data;
    });
    
    const $select = document.querySelector(`.${cx('container')} select`) as HTMLSelectElement;
    $select.addEventListener('change', (e: any) => {
        langStore.set(() => ({ data: e.target.value as Lang}));
    });

    const $button = document.querySelector(`.${cx('container')} button`) as HTMLButtonElement;
    $button.addEventListener('click', () => {
        axios.request({
            method: 'POST',
            url: '/run/' + langStore.state.data,
            data: {
                source: sourceStore.state.data,
            }
        }).then(({ data }) => {
            terminalStore.set(() => ({ data }));
        });
    });

    const raw = getParameter('raw');

    if (raw) {
        const [ filename ] = decodeURIComponent(raw).split('/').slice(-1);
        const [ fileLang ] = filename.split('.').slice(-1) as Lang[];

        langStore.set(() => ({ data: fileLang }));

        axios.request({
            method: 'POST',
            url: '/github/raw',
            data: {
                raw: raw,
            }
        }).then(({ data }) => {
            editor.setValue(data);
        });
    } else {
        langStore.set(() => ({
            data: langs[Math.round(Math.random() * (langs.length - 1))],
        }))
        editor.setValue(initCode[langStore.state.data]);
    }
}