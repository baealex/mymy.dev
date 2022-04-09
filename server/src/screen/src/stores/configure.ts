import { createStore } from '../lib/store';

export const configureStore = createStore({
    runShortcut: 'F5',
    editorFontSize: '16',
    terminalFontSize: '16',
    terminalFontFamily: 'Menlo, Monaco, \'Courier New\', monospace',
});