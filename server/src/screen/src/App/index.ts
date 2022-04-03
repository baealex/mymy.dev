import style from './App.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style);

import axios from 'axios';
import { initCode, Lang, langs } from '../init-code';

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

let lang = langs[Math.round(Math.random() * (langs.length - 1))];
let source = initCode[lang];

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
                <textarea>${source}</textarea>
                <div class="${cx('tools')}">
                    <select>
                        <option ${lang === 'c'   ? 'selected' : ''} value="c">C</option>
                        <option ${lang === 'cpp' ? 'selected' : ''} value="cpp">C++</option>
                        <option ${lang === 'rs'  ? 'selected' : ''} value="rs">Rust</option>
                        <option ${lang === 'js'  ? 'selected' : ''} value="js">JavaScript</option>
                        <option ${lang === 'py'  ? 'selected' : ''} value="py">Python3</option>
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

    setEditorMode(lang);

    editor.on('change', (editor) => {
        source = editor.getValue();
    })

    const $terminal = document.querySelector(`.${cx('terminal')}`) as HTMLDivElement;
    
    const $select = document.querySelector(`.${cx('container')} select`) as HTMLSelectElement;
    $select.addEventListener('change', (e: any) => {
        lang = e.target.value;
        setEditorMode(lang);
    });

    const $button = document.querySelector(`.${cx('container')} button`) as HTMLButtonElement;
    $button.addEventListener('click', () => {
        axios.request({
            method: 'POST',
            url: '/run/' + lang,
            data: {
                source: source,
            }
        }).then(({ data }) => {
            $terminal.textContent = data;
        });
    });

    const raw = getParameter('raw');

    if (raw) {
        const [ filename ] = decodeURIComponent(raw).split('/').slice(-1);
        const [ fileLang ] = filename.split('.').slice(-1);

        lang = fileLang as Lang;
        setEditorMode(lang);
        $select.selectedIndex = langs.findIndex((name) => name === fileLang);

        axios.request({
            method: 'POST',
            url: '/github/raw',
            data: {
                raw: raw,
            }
        }).then(({ data }) => {
            source = data;
            editor.setValue(data);
        });
    }
}