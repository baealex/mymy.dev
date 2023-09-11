import { Component, html } from '~/modules/core'

import { configureStore } from '~/stores/configure'

export default class ModalSettingContent extends Component {
    mount() {
        this.$el.querySelectorAll('input').forEach($input => {
            $input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement
                if (target.min) {
                    if (parseInt(target.value) < parseInt(target.min)) {
                        target.value = '' + target.min
                    }
                }
                configureStore.set((prevState) => ({
                    ...prevState,
                    [target.name]: target.value,
                }))
            })
        })
    }

    render() {
        return html`
            <div class="section">
                <p class="title">Shortcut: Run</p>
                <input disabled name="runShortcut" value="${configureStore.state.runShortcut}"/>
            </div>
            <div class="section">
                <p class="title">Shortcut: Active File Rename</p>
                <input disabled name="runShortcut" value="${configureStore.state.activeFileRenameShortcut}"/>
            </div>
            <div class="section">
                <p class="title">Shortcut: Active File Delete</p>
                <input disabled name="runShortcut" value="${configureStore.state.activeFileDeleteShortcut}"/>
            </div>
            <div class="section">
                <p class="title">Editor: Font Size</p>
                <p class="subtitle">Controls the font size in pixels.</p>
                <input name="editorFontSize" type="number" min="8" value="${configureStore.state.editorFontSize}"/>
            </div>
            <div class="section">
                <p class="title">Terminal: Font Size</p>
                <p class="subtitle">Controls the font size in pixels of the terminal.</p>
                <input name="terminalFontSize" type="number" min="8" value="${configureStore.state.terminalFontSize}"/>
            </div>
            <div class="section">
                <p class="title">Terminal: Font Family</p>
                <p class="subtitle">Controls the font family of the terminal.</p>
                <input name="terminalFontFamily" value="${configureStore.state.terminalFontFamily}"/>
            </div>
        `
    }
}
