import Component from '~/modules/component'
import { getParameter } from '~/modules/location'
import socket from '~/modules/socket'

import { sourceStore } from '~/stores/source'

import { GetGitHubRawEventParams, GetGitHubRawResultEventParams, SOCKET_EVENT_NAME } from '../../../../socket-event'

const getGitHubRaw = (sourcePath: string, validate=true) => {
    if (validate) {
        if (!sourcePath) {
            alert('Path is empty')
            return
        }

        if (
            !sourcePath.startsWith('https://github.com') &&
            !sourcePath.startsWith('https://raw.githubusercontent.com')
        ) {
            alert('Path is not from GitHub')
            return
        }
    }

    if (sourcePath.startsWith('https://raw.githubusercontent.com')) {
        sourcePath = sourcePath.replace('https://raw.githubusercontent.com', '')
    }

    if (sourcePath.startsWith('https://github.com')) {
        sourcePath = sourcePath.replace('https://github.com', '')
        sourcePath = sourcePath.replace('blob/', '')
    }

    const fileName = sourcePath.split('/').slice(-1)[0]

    if (sourceStore.exists(fileName)) {
        alert('Already exists. Retry after rename active file')
        sourceStore.set({ activeFile: fileName })
        return
    }

    socket.emit(SOCKET_EVENT_NAME.GET_GITHUB_RAW, GetGitHubRawEventParams({ raw: sourcePath }))
}

export default class ModalSettingContent extends Component {
    mount() {
        const $input = this.$el.querySelector('input') as HTMLInputElement

        socket.on(SOCKET_EVENT_NAME.GET_GITHUB_RAW_ERROR, () => {
            alert('Something wrong!')
        })

        socket.on(SOCKET_EVENT_NAME.GET_GITHUB_RAW_RESULT, ({ name, data }: GetGitHubRawResultEventParams) => {
            sourceStore.createNewFile({
                fileName: name,
                fileData: data,
            })

            $input.value = ''
        })

        this.$el.querySelector('button')?.addEventListener('click', (e: any) => {
            getGitHubRaw($input.value)
        })

        const raw = decodeURIComponent(getParameter('raw'))

        if (raw && raw.startsWith('/')) {
            getGitHubRaw(raw, false)
        }
    }

    render() {
        return `
            <div class="section">
                <div class="split">
                    <p class="title">Source from GitHub</p>
                    <button>LOAD</button>
                </div>
                <input placeholder="https://github.com/user/repo/source" value=""/>
            </div>
        `
    }
}
