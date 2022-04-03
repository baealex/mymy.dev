import { createStore } from '../lib/store';

export const configureStore = createStore({
    editorFontSize: '16px',
    editorFontFamily: `Menlo, Monaco, 'Courier New', monospace`,
    terminalFontSize: '16px',
    terminalFontFamily: `Menlo, Monaco, 'Courier New', monospace`,
});