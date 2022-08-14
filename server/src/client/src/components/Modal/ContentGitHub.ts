import Component from '@lib/component'
import socket from '@lib/socket'
import { sourceStore } from '@stores/source'
import { GetGitHubRawEventParams, GetGitHubRawResultEventParams, SOCKET_EVENT_NAME } from '../../../../socket-event'

let sourcePath = ''

export default class ModalSettingContent extends Component {
    mount() {
        const $input = this.$el.querySelector('input') as HTMLInputElement

        $input.addEventListener('input', (e: any) => {
            sourcePath = e.target.value
        })

        socket.on(SOCKET_EVENT_NAME.GET_GITHUB_RAW_ERROR, () => {
            alert('Something wrong! 🙀')
        })

        socket.on(SOCKET_EVENT_NAME.GET_GITHUB_RAW_RESULT, ({ data }: GetGitHubRawResultEventParams) => {
            sourceStore.createNewFile({
                fileName: sourcePath.split('/').slice(-1)[0],
                fileData: data,
            })

            sourcePath = ''
            $input.value = ''
        })

        this.$el.querySelector('button')?.addEventListener('click', (e: any) => {
            if (!sourcePath) {
                alert('Path is empty 🙀')
                return
            }

            if (
                !sourcePath.startsWith('https://github.com') &&
                !sourcePath.startsWith('https://raw.githubusercontent.com')
            ) {
                alert('Path is not from GitHub 🙀')
                return
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
                sourceStore.set({ activeFile: fileName })
            } else {
                socket.emit(SOCKET_EVENT_NAME.GET_GITHUB_RAW, GetGitHubRawEventParams({ raw: sourcePath }))
            }
        })
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
