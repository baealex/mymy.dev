import { createStore } from '../lib/store';

export const configureStore = createStore({
    runShortcut: 'F5',
    editorFontSize: '16px',
    terminalFontSize: '16px',
    terminalFontFamily: `Menlo, Monaco, 'Courier New', monospace`,
});