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

interface CreateDockerRunCommandProps {
    env: string
    filename: string
    command: string
}

function createDockerRunCommand({ env, filename, command }: CreateDockerRunCommandProps) {
    return [
        'docker run',
        '--rm',
        '--platform linux/amd64',
        '-i',
        `-v ./${filename}:/temp/${filename}`,
        `baealex/mymydev-env-${env}`,
        `/bin/bash -c "${command}"`,
    ]
}

export default function useSocket(io: Server) {
    io.on('connection', (socket) => {
        socket.on(SOCKET_EVENT_NAME.CODE_RUNNER, ({ language, source }: CodeRunnerEventParams) => {
            if (!['c', 'cpp', 'rs', 'py', 'js'].includes(language)) {
                return
            }

            const uuid = uuidv4()
            const filename = uuid + '.' + language

            try {
                if (language === 'c') {
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(createDockerRunCommand({
                        filename,
                        env: 'cpp',
                        command: `gcc -o ${uuid} /temp/${filename} && ${uuid}`
                    }))}))
                }

                if (language === 'cpp') {
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(createDockerRunCommand({
                        filename,
                        env: 'cpp',
                        command: `g++ -o /temp/${filename.split('.').at(0)} /temp/${filename} && /temp/${filename.split('.').at(0)}`
                    }))}))
                }

                if (language === 'rs') {
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(createDockerRunCommand({
                        filename,
                        env: 'rust',
                        command: `rustc /temp/${filename} && /temp/${uuid}`
                    }))}))
                }

                if (language === 'py') {
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(createDockerRunCommand({
                        filename,
                        env: 'python',
                        command: `python /temp/${filename}`
                    }))}))
                }

                if (language === 'js') {
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(createDockerRunCommand({
                        filename,
                        env: 'node',
                        command: `node /temp/${filename}`
                    }))}))
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
