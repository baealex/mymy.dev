import { iRemember } from '@lib/i-remember';
import { createStore } from 'badland';

export const configureStore = createStore({
    runShortcut: 'F5',
    editorFontSize: '16',
    terminalFontSize: '16',
    terminalFontFamily: 'Menlo, Monaco, \'Courier New\', monospace',
});

iRemember('mymydev__configure', configureStore);