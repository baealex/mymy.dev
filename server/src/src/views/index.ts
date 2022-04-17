import fs from 'fs'

import {
    Request,
    Response,
} from 'express'
import { v4 as uuidv4 } from 'uuid'

import {
    safety,
    runCode,
    cleaner,
} from '../modules/ide'
import axios from 'axios'

export async function runLanguage(req: Request, res: Response) {
    const { language } = req.params

    if (!['c', 'cpp', 'rs', 'py', 'js', 'ts'].includes(language)) {
        res.status(404).send('Not Found').end()
        return
    }

    let { source } = req.body

    const uuid = uuidv4()
    const filename = uuid + '.' + language

    try {
        if (language === 'c') {
            source = safety(source, ['#include', '<stdio.h>'])
            source = '#include <stdio.h>\n' + source
            fs.writeFileSync(filename, source)

            const compileFailed = runCode(['gcc', filename, '-o', uuid], { isCompile: true })
            if (compileFailed) {
                res.send(compileFailed).end()
            }
            res.send(runCode(['./' + uuid])).end()
        }

        if (language === 'cpp') {
            source = safety(source, ['#include', '<iostream>'])
            source = '#include <iostream>\n' + source
            fs.writeFileSync(filename, source)

            const compileFailed = runCode(['g++', filename, '-o', uuid], { isCompile: true })
            if (compileFailed) {
                res.send(compileFailed).end()
            }
            res.send(runCode(['./' + uuid])).end()
        }

        if (language === 'rs') {
            source = safety(source, ['std::'])
            fs.writeFileSync(filename, source)

            const compileFailed = runCode(['rustc', filename], { isCompile: true })
            if (compileFailed) {
                res.send(compileFailed).end()
            }
            res.send(runCode(['./' + uuid])).end()
        }

        if (language === 'py') {
            source = safety(source, ['import', 'open'])
            fs.writeFileSync(filename, source)

            res.send(runCode(['python', filename])).end()
        }

        if (language === 'js') {
            source = safety(source, ['require', 'import'])
            fs.writeFileSync(filename, source)

            res.send(runCode(['node', filename])).end()
        }

        if (language === 'ts') {
            source = safety(source, ['require', 'import'])
            fs.writeFileSync(filename, source)

            res.send(runCode(['ts-node', filename])).end()
        }
    } catch(e) {

    }

    cleaner(filename)
}

export async function getGitHubRaw(req: Request, res: Response) {
    const { raw } = req.body

    const { data } = await axios.request({
        method: 'GET',
        url: encodeURI('https://raw.githubusercontent.com' + raw)
    })

    res.send(data).end()
}