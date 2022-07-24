import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import {
    safety,
    runCode,
    cleaner,
} from '../modules/ide'

export default function useSocket(io: Server) {
    io.on('connection', (socket) => {
        socket.on('code-runner', ({ language, source }) => {
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
                        socket.emit('code-runner-result', { result: compileFailed })
                    } else {
                        socket.emit('code-runner-result', { result: runCode(['./' + uuid]) })
                    }
                }

                if (language === 'cpp') {
                    source = safety(source, ['#include', '<iostream>'])
                    source = '#include <iostream>\n' + source
                    fs.writeFileSync(filename, source)

                    const compileFailed = runCode(['g++', filename, '-o', uuid], { isCompile: true })
                    if (compileFailed) {
                        socket.emit('code-runner-result', { result: compileFailed })
                    } else {
                        socket.emit('code-runner-result', { result: runCode(['./' + uuid]) })
                    }
                }

                if (language === 'rs') {
                    source = safety(source, ['std::'])
                    fs.writeFileSync(filename, source)

                    const compileFailed = runCode(['rustc', filename], { isCompile: true })
                    if (compileFailed) {
                        socket.emit('code-runner-result', { result: compileFailed })
                    } else {
                        socket.emit('code-runner-result', { result: runCode(['./' + uuid]) })
                    }
                }

                if (language === 'py') {
                    source = safety(source, ['import', 'open'])
                    fs.writeFileSync(filename, source)

                    socket.emit('code-runner-result', { result: runCode(['python', filename]) })
                }

                if (language === 'js') {
                    source = safety(source, ['require', 'import'])
                    fs.writeFileSync(filename, source)

                    socket.emit('code-runner-result', { result: runCode(['node', filename]) })
                }

                if (language === 'ts') {
                    source = safety(source, ['require', 'import'])
                    fs.writeFileSync(filename, source)

                    socket.emit('code-runner-result', { result: runCode(['ts-node', filename]) })
                }
            } catch(e) {
                socket.emit('code-runner-error')
                console.log(e)
            } finally {
                cleaner(filename)
            }
        })
    })
}
