import {
    Request,
    Response,
} from 'express'

import fs from 'fs'
import subprocess from 'child_process'

import { v4 as uuidv4 } from 'uuid';

function runCode(commands: string[], isCompile=false) {
    try {
        const result = subprocess.execSync(commands.join(' '), {
            timeout: 5000
        })
        if (isCompile) {
            return ''
        }
        return(result.toString())
    } catch(e: any) {
        if (e.stderr) {
            return e.stderr.toString()
        }
    }
}

function safety(source: string, keywords: string[]) {
    for (const keyword of keywords) {
        source = source.replace(new RegExp(keyword), '');
    }
    return source
}

function cleaner(filename: string) {
    const [ uuid ] = filename.split('.')
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename)
    }
    if (fs.existsSync(uuid)) {
        fs.unlinkSync(uuid)
    }
}

export async function runLanguage(req: Request, res: Response) {
    const { language } = req.params

    if (!['c', 'cpp', 'rs', 'py', 'js'].includes(language)) {
        res.status(404).send('Not Found').end()
    }

    let { source } = req.body

    const uuid = uuidv4()
    const filename = uuid + '.' + language

    try {
        if (language === 'c') {
            source = safety(source, ['#include', '<stdio.h>'])
            source = '#include <stdio.h>\n' + source
            fs.writeFileSync(filename, source)

            const compileFailed = runCode(['gcc', filename, '-o', uuid], true)
            if (compileFailed) {
                res.send(compileFailed).end()
            }
            res.send(runCode(['./' + uuid])).end()
        }

        if (language === 'cpp') {
            source = safety(source, ['#include', '<iostream>'])
            source = '#include <iostream>\n' + source
            fs.writeFileSync(filename, source)

            const compileFailed = runCode(['g++', filename, '-o', uuid], true)
            if (compileFailed) {
                res.send(compileFailed).end()
            }
            res.send(runCode(['./' + uuid])).end()
        }

        if (language === 'rs') {
            source = safety(source, ['std::'])
            fs.writeFileSync(filename, source)

            const compileFailed = runCode(['rustc', filename], true)
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
    } catch(e) {

    }

    cleaner(filename)
}