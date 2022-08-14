import { createStore } from 'badland'
import { rememberOnStorage } from 'badland/dist/plugin'

export const configureStore = createStore({
    runShortcut: 'F5',
    activeFileRenameShortcut: 'F2',
    activeFileDeleteShortcut: 'Delete',
    editorFontSize: '16',
    terminalFontSize: '16',
    terminalFontFamily: 'Menlo, Monaco, \'Courier New\', monospace',
})

rememberOnStorage('mymydev__configure', configureStore)
