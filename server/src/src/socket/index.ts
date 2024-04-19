import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import axios from 'axios'

import {
    runCode,
    cleaner,
} from '../modules/ide'
import {
    SOCKET_EVENT_NAME,
    CodeRunnerEventParams,
    CodeRunnerResultEventParams,
    GetGitHubRawEventParams,
    GetGitHubRawResultEventParams
} from '../../socket-event'

export default function useSocket(io: Server) {
    io.on('connection', (socket) => {
        socket.on(SOCKET_EVENT_NAME.CODE_RUNNER, ({ language, source }: CodeRunnerEventParams) => {
            const uuid = uuidv4()
            const filename = uuid + '.' + language

            try {
                fs.writeFileSync(filename, source)

                switch (language) {
                case 'c':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'cpp',
                        command: `gcc -o /temp/${uuid} /temp/${filename} && /temp/${uuid}`
                    })}))
                    break
                case 'cpp':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'cpp',
                        command: `g++ -o /temp/${uuid} /temp/${filename} && /temp/${uuid}`
                    })}))
                    break
                case 'dart':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'dart',
                        command: `dart /temp/${filename}`
                    })}))
                    break
                case 'ts':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'deno',
                        command: `deno run /temp/${filename}`
                    })}))
                    break
                case 'js':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'node',
                        command: `node /temp/${filename}`
                    })}))
                    break
                case 'py':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'python',
                        command: `python /temp/${filename}`
                    })}))
                    break
                case 'rb':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'ruby',
                        command: `ruby /temp/${filename}`
                    })}))
                    break
                case 'rs':
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode({
                        filename,
                        env: 'rust',
                        command: `rustc -o /temp/${uuid} /temp/${filename} && /temp/${uuid}`
                    })}))
                    break
                default:
                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_ERROR)
                    break
                }
            } catch (e) {
                socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_ERROR)
                console.log(e)
            } finally {
                cleaner(filename)
            }
        })

        socket.on(SOCKET_EVENT_NAME.GET_GITHUB_RAW, async ({ raw }: GetGitHubRawEventParams) => {
            if (!raw) {
                socket.emit(SOCKET_EVENT_NAME.GET_GITHUB_RAW_ERROR)
            }

            try {
                const { data } = await axios.request({
                    method: 'GET',
                    url: encodeURI('https://raw.githubusercontent.com' + raw)
                })
                const name = raw.split('/').slice(-1)[0]
                socket.emit(SOCKET_EVENT_NAME.GET_GITHUB_RAW_RESULT, GetGitHubRawResultEventParams({ name, data }))
            } catch {
                socket.emit(SOCKET_EVENT_NAME.GET_GITHUB_RAW_ERROR)
            }
        })
    })
}
