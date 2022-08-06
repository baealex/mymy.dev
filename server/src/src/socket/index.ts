import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import {
    safety,
    runCode,
    cleaner,
} from '../modules/ide'
import {
    SOCKET_EVENT_NAME,
    CodeRunnerEventParams,
    CodeRunnerResultEventParams
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
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: compileFailed }))
                    } else {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: runCode(['./' + uuid])}))
                    }
                }

                if (language === 'cpp') {
                    source = safety(source, ['#include', '<iostream>'])
                    source = '#include <iostream>\n' + source
                    fs.writeFileSync(filename, source)

                    const compileFailed = runCode(['g++', filename, '-o', uuid], { isCompile: true })
                    if (compileFailed) {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: compileFailed }))
                    } else {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: runCode(['./' + uuid]) }))
                    }
                }

                if (language === 'rs') {
                    source = safety(source, ['std::'])
                    fs.writeFileSync(filename, source)

                    const compileFailed = runCode(['rustc', filename], { isCompile: true })
                    if (compileFailed) {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: compileFailed }))
                    } else {
                        socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: runCode(['./' + uuid]) }))
                    }
                }

                if (language === 'py') {
                    source = safety(source, ['import', 'open'])
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: runCode(['python', filename]) }))
                }

                if (language === 'js') {
                    source = safety(source, ['require', 'import'])
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: runCode(['node', filename]) }))
                }

                if (language === 'ts') {
                    source = safety(source, ['require', 'import'])
                    fs.writeFileSync(filename, source)

                    socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_RESULT, CodeRunnerResultEventParams({ result: runCode(['ts-node', filename]) }))
                }
            } catch(e) {
                socket.emit(SOCKET_EVENT_NAME.CODE_RUNNER_ERROR)
                console.log(e)
            } finally {
                cleaner(filename)
            }
        })
    })
}
