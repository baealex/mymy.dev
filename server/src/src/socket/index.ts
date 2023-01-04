import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import axios from 'axios'

import {
    safety,
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
            if (!['c', 'cpp', 'rs', 'py', 'js', 'ts'].includes(language)) {
                return
            }

            const uuid = uuidv4()
            const filename = uuid + '.' + language

            try {
                if (language === 'c') {
                    source = safety(source, ['#include', '<stdio.h>'])
                    source = '#include <stdio.h>\n' + source
                    fs.writeFileSync(filename, source)

                    const compileFailed = runCode(['gcc', filename, '-o', uuid], { isCompile: true })
                    if (compileFailed) {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: compileFailed }))
                    } else {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(['./' + uuid])}))
                    }
                }

                if (language === 'cpp') {
                    source = safety(source, ['#include', '<iostream>'])
                    source = '#include <iostream>\n' + source
                    fs.writeFileSync(filename, source)

                    const compileFailed = runCode(['g++', filename, '-o', uuid], { isCompile: true })
                    if (compileFailed) {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: compileFailed }))
                    } else {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(['./' + uuid]) }))
                    }
                }

                if (language === 'rs') {
                    source = safety(source, ['std::'])
                    fs.writeFileSync(filename, source)

                    const compileFailed = runCode(['rustc', filename], { isCompile: true })
                    if (compileFailed) {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: compileFailed }))
                    } else {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(['./' + uuid]) }))
                    }
                }

                if (language === 'py') {
                    source = safety(source, ['import', 'open'])
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(['python', filename]) }))
                }

                if (language === 'js') {
                    source = safety(source, ['require', 'import'])
                    source = 'const process = {};\n' + source
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(['node', filename]) }))
                }

                if (language === 'ts') {
                    source = safety(source, ['require', 'import'])
                    source = 'process = {};\n' + source
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ data: runCode(['ts-node', filename]) }))
                }
            } catch(e) {
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
