import Component from '@lib/component';

import { configureStore } from '@stores/configure';

export default class ModalSettingContent extends Component {
    mount() {
        this.$el.querySelectorAll('input').forEach($input => {
            $input.addEventListener('input', (e: any) => {
                if (e.target.min) {
                    if (parseInt(e.target.value) < parseInt(e.target.min)) {
                        e.target.value = '' + e.target.min;
                    }
                }
                configureStore.set((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                }));
            });
        });
    }

    render() {
        return `
            <div class="section">
                <p class="title">Shortcut: Run</p>
                <input disabled name="runShortcut" value="${configureStore.state.runShortcut}"/>
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
        `;
    }
}