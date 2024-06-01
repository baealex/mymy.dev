import { Component, html } from '~/modules/core';
import { getParameter } from '~/modules/location';
import socket from '~/modules/socket';

import { sourceStore } from '~/stores/source';

import type { GetGitHubRawResultEventParams } from '../../../../socket-event';
import { GetGitHubRawEventParams, SOCKET_EVENT_NAME } from '../../../../socket-event';

const getGitHubRaw = (sourcePath: string, validate=true) => {
    if (validate) {
        if (!sourcePath) {
            alert('Path is empty');
            return;
        }

        if (
            !sourcePath.startsWith('https://github.com') &&
            !sourcePath.startsWith('https://raw.githubusercontent.com')
        ) {
            alert('Path is not from GitHub');
            return;
        }
    }

    if (sourcePath.startsWith('https://raw.githubusercontent.com')) {
        sourcePath = sourcePath.replace('https://raw.githubusercontent.com', '');
    }

    if (sourcePath.startsWith('https://github.com')) {
        sourcePath = sourcePath.replace('https://github.com', '');
        sourcePath = sourcePath.replace('blob/', '');
    }

    const fileName = sourcePath.split('/').slice(-1)[0];

    if (sourceStore.exists(fileName)) {
        alert('Already exists. Retry after rename active file');
        sourceStore.set({ activeFile: fileName });
        return;
    }

    socket.emit(SOCKET_EVENT_NAME.GET_GITHUB_RAW, GetGitHubRawEventParams({ raw: sourcePath }));
};

export default class ModalSettingContent extends Component {
    $input?: HTMLInputElement;
    $button?: HTMLButtonElement;

    mount() {
        this.$input = this.useSelector('input');
        this.$button = this.useSelector('button[aria-label="load"]');

        socket.on(SOCKET_EVENT_NAME.GET_GITHUB_RAW_ERROR, () => {
            alert('Something wrong!');
        });

        socket.on(SOCKET_EVENT_NAME.GET_GITHUB_RAW_RESULT, ({ name, data }: GetGitHubRawResultEventParams) => {
            sourceStore.createNewFile({
                fileName: name,
                fileData: data
            });

            this.$input!.value = '';
        });

        this.$button.addEventListener('click', () => {
            getGitHubRaw(this.$input!.value);
        });

        const raw = decodeURIComponent(getParameter('raw'));

        if (raw && raw.startsWith('/')) {
            getGitHubRaw(raw, false);
        }
    }

    render() {
        return html`
            <div class="section">
                <div class="split">
                    <p class="title">Source from GitHub</p>
                    <button aria-label="load">LOAD</button>
                </div>
                <input placeholder="https://github.com/user/repo/source" value=""/>
            </div>
        `;
    }
}
